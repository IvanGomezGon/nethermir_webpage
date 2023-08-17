const RosApi = require("node-routeros").RouterOSAPI;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
var logger = require(path.resolve(__dirname, "logger.js"));

const conn = new RosApi({
    host: process.env.ROUTEROS_HOST,
    user: process.env.ROUTEROS_USER,
    password: process.env.ROUTEROS_PASSWORD,
});

// groupName = XX-2022-2-300
// portUdp = 65439
// wgRouterPrivateKey
// wgGroupPublicKey = d6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=
// vlanId = 300
// Interface = eth3
const generateRouterOSConfig = (groupName, wgRouterPrivateKey, wgGroupPublicKey, port_udp, interface, vlanId) => {
    logger.info("generateRouterOSConfig");
    conn.connect()
        .then(() => {
            logger.info("Connected to host!");
            conn.write("/interface/list/add", [`=comment=LIST-${groupName}`, `=name=LIST-${groupName}`])
                .then((data) => {
                    logger.info(`interface list name added, ${data}`);
                    return conn.write("/interface/wireguard/add", [`=comment=WG-${groupName}`, `=listen-port=${port_udp}`, `=mtu=1420`, `=name=WG-${groupName}`, `=private-key=${wgRouterPrivateKey}`]);
                })

                .then((data) => {
                    logger.info(`interface wireguard added, ${data}`);
                    return conn.write("/interface/wireguard/peers/add", [`=allowed-address=10.0.1.0/30,10.1.1.0/30`, `=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=public-key=${wgGroupPublicKey}`]);
                })

                .then((data) => {
                    logger.info(`interface wireguard peers added, ${data}`);
                    return conn.write("/interface/vlan/add", [`=comment=VLAN-${groupName}`, `=interface=${interface}`, `=name=VLAN-${groupName}`, `=vlan-id=${vlanId}`]);
                })

                .then((data) => {
                    logger.info(`interface vlan added, ${data}`);
                    return conn.write("/ip/vrf/add", [`=comment=VRF-${groupName}`, `=interfaces=WG-${groupName},VLAN-${groupName}`, `=name=VRF-${groupName}`]);
                })

                .then((data) => {
                    logger.info(`ip vrf added, ${data}`);
                    return conn.write("/interface/list/member/add", [`=comment=LIST-${groupName}`, `=interface=VLAN-${groupName}`, `=list=LIST-${groupName}`]);
                })

                .then((data) => {
                    logger.info(`interface list member vlan added, ${data}`);
                    return conn.write("/interface/list/member/add", [`=comment=LIST-${groupName}`, `=interface=WG-${groupName}`, `=list=LIST-${groupName}`]);
                })

                .then((data) => {
                    logger.info(`interface list member wireguard added, ${data}`);
                    return conn.write("/ip/address/add", [`=address=10.0.1.1/30`, `=comment=VLAN-${groupName}`, `=interface=VLAN-${groupName}`, `=network=10.0.1.0`]);
                })

                .then((data) => {
                    logger.info(`ip address vlan added, ${data}`);
                    return conn.write("/ip/address/add", [`=address=10.1.1.1/30`, `=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=network=10.1.1.0`]);
                })

                .then((data) => {
                    logger.info(`ip address wireguard added, ${data}`);
                    return conn.write("/ip/firewall/filter/add", [`=action=accept`, `=chain=forward`, `=comment=defconf: accept from ${groupName} to ${groupName}`, `=in-interface-list=LIST-${groupName}`, `=out-interface-list=LIST-${groupName}`]);
                })
                .then((data) => {
                    logger.info(`ip firewall filter added, ${data}`);
                    logger.info(`closing connection routeros...`);
                    conn.close();
                })
                .catch((err) => {
                    logger.info(`Error routeros on execution${err}`);
                    logger.info(`closing connection routeros...`);
                    conn.close();
                });
        })
        .catch((err) => {
            logger.info(`Error routeros failed to connect${err}`);
        });
};

const getIdToRemove = (data, searchKey, searchValue) => {
    for (row of data) {
        //logger.info(`ROW: ${JSON.stringify(row)}`)
        //logger.info(` row: ${row[searchKey]} searchValue: ${searchValue} id ${row}`)
        if (row[searchKey] == searchValue) {
            return row[".id"];
        }
    }
    logger.error(`Couldn't find searchValue ${searchValue} from column ${searchKey} in data ${JSON.stringify(data)} to remove in routeros`);
    return false;
};
const eliminateRouterOSConfigMain = async (groupName) => {
    await eliminateListMemberOSConfig(groupName);
    //TODO: This timeout shouldn't be necessary but it is
    setTimeout(function () {
        eliminateRouterOSConfigSecond(groupName);
    }, 5000);
};
const eliminateListMemberOSConfig = (groupName) => {
    return new Promise((resolve, reject) => {
        conn.connect()
            .then(() => {
                logger.info("Connected to host!");
                conn.write("/interface/list/member/print", [])
                    .then((data) => {
                        idRemove = getIdToRemove(data, "interface", `VLAN-${groupName}`);
                        return conn.write("/interface/list/member/remove", [`=.id=${idRemove}`]);
                    })

                    ///interface/list/member/remove
                    .then((data) => {
                        logger.info(`interface list member vlan removed, ${data}`);
                        return conn.write("/interface/list/member/print", []);
                    })
                    .then((data) => {
                        idRemove = getIdToRemove(data, "interface", `WG-${groupName}`);
                        return conn.write("/interface/list/member/remove", [`=.id=${idRemove}`]);
                    })

                    .then((data) => {
                        logger.info(`ip firewall filter removed, ${data}`);
                        logger.info(`closing connection routeros...`);
                        conn.close().then(resolve());
                    })
                    .catch((err) => {
                        logger.info(`Error routeros${err}`);
                        logger.info(`closing connection routeros...`);
                        conn.close().then(resolve());
                    });
            })
            .catch((err) => {
                logger.info(`Error routeros${err}`);
                conn.close().then(resolve());
            });
    });
};
const eliminateRouterOSConfig = (groupName) => {
    logger.info("eliminateRouterOSConfig");
    conn.connect()
        .then(() => {
            logger.info("Connected to host!");
            conn.write("/interface/list/print", [])
                .then((data) => {
                    idRemove = getIdToRemove(data, "name", `LIST-${groupName}`);
                    return conn.write("/interface/list/remove", [`=.id=${idRemove}`]);
                })

                ///interface/wireguard/remove
                .then((data) => {
                    logger.info(`interface list name removed, ${data}`);
                    return conn.write("/interface/wireguard/print", []);
                })
                .then((data) => {
                    idRemove = getIdToRemove(data, "comment", `WG-${groupName}`);
                    return conn.write("/interface/wireguard/remove", [`=.id=${idRemove}`]);
                })

                ///interface/wireguard/peers/remove
                .then((data) => {
                    logger.info(`interface wireguard removed, ${data}`);
                    return conn.write("/interface/wireguard/peers/print", []);
                })
                .then((data) => {
                    idRemove = getIdToRemove(data, "comment", `WG-${groupName}`);
                    return conn.write("/interface/wireguard/peers/remove", [`=.id=${idRemove}`]);
                })

                ///interface/vlan/remove
                .then((data) => {
                    logger.info(`interface wireguard peers removed, ${data}`);
                    return conn.write("/interface/vlan/print", []);
                })
                .then((data) => {
                    idRemove = getIdToRemove(data, "comment", `VLAN-${groupName}`);
                    return conn.write("/interface/vlan/remove", [`=.id=${idRemove}`]);
                })

                ///ip/vrf/remove
                .then((data) => {
                    logger.info(`interface vlan removed, ${data}`);
                    return conn.write("/ip/vrf/print", []);
                })
                .then((data) => {
                    idRemove = getIdToRemove(data, "name", `VRF-${groupName}`);
                    return conn.write("/ip/vrf/remove", [`=.id=${idRemove}`]);
                })

                ///ip/address/remove
                .then((data) => {
                    logger.info(`ip vrf removed, ${data}`);
                    return conn.write("/ip/address/print", []);
                })
                .then((data) => {
                    idRemove = getIdToRemove(data, "comment", `VLAN-${groupName}`);
                    return conn.write("/ip/address/remove", [`=.id=${idRemove}`]);
                })

                ///ip/address/remove
                .then((data) => {
                    logger.info(`ip address vlan removed, ${data}`);
                    return conn.write("/ip/address/print", []);
                })
                .then((data) => {
                    idRemove = getIdToRemove(data, "comment", `WG-${groupName}`);
                    return conn.write("/ip/address/remove", [`=.id=${idRemove}`]);
                })

                ///ip/firewall/filter/remove
                .then((data) => {
                    logger.info(`ip address wireguard removed, ${data}`);
                    return conn.write("/ip/firewall/filter/print", []);
                })
                .then((data) => {
                    idRemove = getIdToRemove(data, "comment", `defconf: accept from ${groupName} to ${groupName}`);
                    return conn.write("/ip/firewall/filter/remove", [`=.id=${idRemove}`]);
                })

                .then((data) => {
                    logger.info(`ip firewall filter removed, ${data}`);
                    logger.info(`closing connection routeros...`);
                    conn.close();
                })
                .catch((err) => {
                    logger.info(`Error routeros${err}`);
                    logger.info(`closing connection routeros...`);
                    conn.close();
                });
        })
        .catch((err) => {
            logger.info(`Error routeros${err}`);
        });
};
///generateRouterOSConfig('XX-2022-2-300', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 65439, "ether1", 300)
//eliminateRouterOSConfigMain("XX-2022-2-300");

module.exports = {
    generateRouterOSConfig,
};
