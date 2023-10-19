const RosApi = require("node-routeros").RouterOSAPI;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
var logger = require(path.resolve(__dirname, "logger.js"));
const { sleep } = require(path.resolve(__dirname, "globalFunctions.js"));
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
    return new Promise(async (resolve, reject) => {
        logger.info("generateRouterOSConfig");

        conn.connect()
            .then(() => {
                logger.info("Connected to host!");

                ///interface/list/add
                conn.write("/interface/list/add", [`=comment=LIST-${groupName}`, `=name=LIST-${groupName}`])

                    ///interface/wireguard/add
                    .then((data) => {
                        logger.info(`interface list name added, ${data}`);
                        return conn.write("/interface/wireguard/add", [`=comment=WG-${groupName}`, `=listen-port=${port_udp}`, `=mtu=1420`, `=name=WG-${groupName}`, `=private-key=${wgRouterPrivateKey}`]);
                    })

                    ///interface/wireguard/peers/add
                    .then((data) => {
                        logger.info(`interface wireguard added, ${data}`);
                        return conn.write("/interface/wireguard/peers/add", [`=allowed-address=10.0.1.0/30,10.1.1.0/30`, `=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=public-key=${wgGroupPublicKey}`]);
                    })

                    ///interface/vlan/add
                    .then((data) => {
                        logger.info(`interface wireguard peers added, ${data}`);
                        return conn.write("/interface/vlan/add", [`=comment=VLAN-${groupName}`, `=interface=${interface}`, `=name=VLAN-${groupName}`, `=vlan-id=${vlanId}`]);
                    })

                    ///ip/vrf/add
                    .then((data) => {
                        logger.info(`interface vlan added, ${data}`);
                        return conn.write("/ip/vrf/add", [`=comment=VRF-${groupName}`, `=interfaces=WG-${groupName},VLAN-${groupName}`, `=name=VRF-${groupName}`]);
                    })

                    ///interface/list/member/add
                    .then((data) => {
                        logger.info(`ip vrf added, ${data}`);
                        return conn.write("/interface/list/member/add", [`=comment=VLAN-${groupName}`, `=interface=VLAN-${groupName}`, `=list=LIST-${groupName}`]);
                    })

                    ///interface/list/member/add
                    .then((data) => {
                        logger.info(`interface list member vlan added, ${data}`);
                        return conn.write("/interface/list/member/add", [`=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=list=LIST-${groupName}`]);
                    })

                    ///ip/address/add
                    .then((data) => {
                        logger.info(`interface list member wireguard added, ${data}`);
                        return conn.write("/ip/address/add", [`=address=10.0.1.1/30`, `=comment=VLAN-${groupName}`, `=interface=VLAN-${groupName}`, `=network=10.0.1.0`]);
                    })

                    ///ip/address/add
                    .then((data) => {
                        logger.info(`ip address vlan added, ${data}`);
                        return conn.write("/ip/address/add", [`=address=10.1.1.1/30`, `=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=network=10.1.1.0`]);
                    })

                    ///ip/firewall/filter/add
                    .then((data) => {
                        logger.info(`ip address wireguard added, ${data}`);
                        return conn.write("/ip/firewall/filter/add", [`=action=accept`, `=chain=forward`, `=comment=defconf: accept from ${groupName} to ${groupName}`, `=in-interface-list=LIST-${groupName}`, `=out-interface-list=LIST-${groupName}`]);
                    })

                    .then((data) => {
                        logger.info(`ip firewall filter added, ${data}`);
                        return conn.write("/ip/firewall/filter/print", []);
                    })
                    //Closing connection
                    .then(async (data) => {
                        logger.info(`/ip/firewall/filter/print`)
                        newRuleId = await getIdToRemove(data, `defconf: accept from ${groupName} to ${groupName}`);
                        dropId = await getIdToRemove(data, `defconf: drop all remaining forward traffic`);
                        logger.info(`${newRuleId}, ${dropId}`)
                        data = await conn.write("/ip/firewall/filter/move", [`=numbers=${newRuleId}`, `=destination=${dropId}`]);
                        logger.info(`ip firewall filter moved, ${data}`);
                        logger.info(`closing connection routeros...`);
                        conn.close();
                        alreadyConneting = false;
                        resolve("Success");
                    })

                    //Catching errors in execution
                    .catch((err) => {
                        logger.info(`Error routeros on execution ${err}`);
                        logger.info(`closing connection routeros...`);
                        conn.close();
                        resolve(`Error routeros on execution ${err}`);
                    });
            })

            //Catching errors in connection
            .catch((err) => {
                logger.info(`Error routeros failed to connect ${err}`);
                resolve(`Error routeros failed to connect ${err}`);
            });
    });
};

const getIdToRemove = (data, searchValue) => {
    return new Promise((resolve, reject) => {
        for (row of data) {
            if (row["comment"] == searchValue) {
                resolve(row[".id"]);
            }
        }
    })

};

const deleteRouterOSConfig = async (groupName) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`deleteRouterOSConfig ${groupName}`);
        await sleep(5000);
        conn.connect()
            .then(() => {
                logger.info("Connected to host!");

                //interface/list/remove
                conn.write("/interface/list/print", [])
                    .then( async (data) => {
                        logger.info("Interface list print")
                        idRemove = await getIdToRemove(data, `LIST-${groupName}`);
                        logger.info(idRemove)
                        return conn.write("/interface/list/remove", [`=.id=${idRemove}`]);
                    })

                    ///interface/wireguard/remove
                    .then((data) => {
                        logger.info(`interface list name removed, ${data}`);
                        return conn.write("/interface/wireguard/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `WG-${groupName}`);
                        return conn.write("/interface/wireguard/remove", [`=.id=${idRemove}`]);
                    })

                    ///interface/wireguard/peers/remove
                    .then((data) => {
                        logger.info(`interface wireguard removed, ${data}`);
                        return conn.write("/interface/wireguard/peers/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `WG-${groupName}`);
                        return conn.write("/interface/wireguard/peers/remove", [`=.id=${idRemove}`]);
                    })

                    ///interface/vlan/remove
                    .then((data) => {
                        logger.info(`interface wireguard peers removed, ${data}`);
                        return conn.write("/interface/vlan/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `VLAN-${groupName}`);
                        return conn.write("/interface/vlan/remove", [`=.id=${idRemove}`]);
                    })

                    ///ip/vrf/remove
                    .then((data) => {
                        logger.info(`interface vlan removed, ${data}`);
                        return conn.write("/ip/vrf/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `VRF-${groupName}`);
                        return conn.write("/ip/vrf/remove", [`=.id=${idRemove}`]);
                    })

                    ///interface/list/member/remove
                    .then((data) => {
                        logger.info(`ip vrf removed, ${data}`);
                        return conn.write("/interface/list/member/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `VLAN-${groupName}`);
                        return conn.write("/interface/list/member/remove", [`=.id=${idRemove}`]);
                    })

                    ///interface/list/member/remove
                    .then((data) => {
                        logger.info(`interface list member vlan removed, ${data}`);
                        return conn.write("/interface/list/member/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `WG-${groupName}`);
                        return conn.write("/interface/list/member/remove", [`=.id=${idRemove}`]);
                    })

                    ///ip/address/remove
                    .then((data) => {
                        logger.info(`interface list member wireguard removed, ${data}`);
                        return conn.write("/ip/address/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `VLAN-${groupName}`);
                        return conn.write("/ip/address/remove", [`=.id=${idRemove}`]);
                    })

                    ///ip/address/remove
                    .then((data) => {
                        logger.info(`ip address vlan removed, ${data}`);
                        return conn.write("/ip/address/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `WG-${groupName}`);
                        return conn.write("/ip/address/remove", [`=.id=${idRemove}`]);
                    })

                    ///ip/firewall/filter/remove
                    .then((data) => {
                        logger.info(`ip address wireguard removed, ${data}`);
                        return conn.write("/ip/firewall/filter/print", []);
                    })
                    .then( async (data) => {
                        idRemove = await getIdToRemove(data, `defconf: accept from ${groupName} to ${groupName}`);
                        return conn.write("/ip/firewall/filter/remove", [`=.id=${idRemove}`]);
                    })

                    //Closing connection
                    .then((data) => {
                        logger.info(`ip firewall filter removed, ${data}`);
                        logger.info(`closing connection routeros...`);
                        conn.close();
                        alreadyConneting = false;
                        resolve("Success");
                    })

                    //Catching errors in execution
                    .catch((err) => {
                        logger.info(`Error deleting router config in execution${err}`);
                        logger.info(`closing connection routeros...`);
                        conn.close();
                        alreadyConneting = false;
                        resolve("Error");
                    });
            })

            //Catching errors in connection
            .catch((err) => {
                logger.info(`Error deleting router config in connection ${err}`);
                console.log("NOW CONNECTION IS" , alreadyConneting)
                resolve("Error");
            });
    });
};

//generateRouterOSConfig('XX-2022-2-111', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 65439, "ether1",13)

module.exports = {
    generateRouterOSConfig,
    deleteRouterOSConfig,
};
