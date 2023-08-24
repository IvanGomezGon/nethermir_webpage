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
        try {
            await conn.connect();
            logger.info("Connected to host!");
        } catch (err){
            logger.error(`Error routeros failed to connect ${err}`);
            resolve(`Error routeros failed to connect ${err}`);
        }
        try {
            data = await conn.write("/interface/list/add", [`=comment=LIST-${groupName}`, `=name=LIST-${groupName}`]);
            logger.info(`interface list name added, ${data}`);
            data = await conn.write("/interface/wireguard/add", [`=comment=WG-${groupName}`, `=listen-port=${port_udp}`, `=mtu=1420`, `=name=WG-${groupName}`, `=private-key=${wgRouterPrivateKey}`]);
            logger.info(`interface wireguard added, ${data}`);
            data = await conn.write("/interface/wireguard/peers/add", [`=allowed-address=10.0.1.0/30,10.1.1.0/30`, `=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=public-key=${wgGroupPublicKey}`]);
            logger.info(`interface wireguard peers added, ${data}`);
            data = await conn.write("/interface/vlan/add", [`=comment=VLAN-${groupName}`, `=interface=${interface}`, `=name=VLAN-${groupName}`, `=vlan-id=${vlanId}`]);
            logger.info(`interface vlan added, ${data}`);
            data = await conn.write("/ip/vrf/add", [`=comment=VRF-${groupName}`, `=interfaces=WG-${groupName},VLAN-${groupName}`, `=name=VRF-${groupName}`]);
            logger.info(`ip vrf added, ${data}`);
            data = await conn.write("/interface/list/member/add", [`=comment=VLAN-${groupName}`, `=interface=VLAN-${groupName}`, `=list=LIST-${groupName}`]);
            logger.info(`interface list member vlan added, ${data}`);
            data = await conn.write("/interface/list/member/add", [`=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=list=LIST-${groupName}`]);
            logger.info(`interface list member wireguard added, ${data}`);
            data = await conn.write("/ip/address/add", [`=address=10.0.1.1/30`, `=comment=VLAN-${groupName}`, `=interface=VLAN-${groupName}`, `=network=10.0.1.0`]);
            logger.info(`ip address vlan added, ${data}`);
            data = await conn.write("/ip/address/add", [`=address=10.1.1.1/30`, `=comment=WG-${groupName}`, `=interface=WG-${groupName}`, `=network=10.1.1.0`]);
            logger.info(`ip address wireguard added, ${data}`);
            data = await conn.write("/ip/firewall/filter/add", [`=action=accept`, `=chain=forward`, `=comment=defconf: accept from ${groupName} to ${groupName}`, `=in-interface-list=LIST-${groupName}`, `=out-interface-list=LIST-${groupName}`]);
            logger.info(`ip firewall filter added, ${data}`);
            data = await conn.write("/ip/firewall/filter/print", []);
            newRuleId = await getIdToRemove(data, `defconf: accept from ${groupName} to ${groupName}`);
            dropId = await getIdToRemove(data, `defconf: drop all remaining forward traffic`);
            data = await conn.write("/ip/firewall/filter/move", [`=numbers=${newRuleId}`, `=destination=${dropId}`]);
            logger.info(`ip firewall filter move drop all finished, ${data}`);
            logger.info(`closing connection routeros...`);
            data = await conn.close();
            resolve("Success");
        } catch (err) {
            logger.info(`Error routeros on execution ${err}`);
            logger.info(`closing connection routeros...`);
            data = await conn.close();
            resolve(`Error routeros on execution ${err}`);
        }
    });
};

const getIdToRemove = (data, searchValue) => {
    return new Promise((resolve, reject) => {
        for (row of data) {
            if (row["comment"] == searchValue) {
                resolve(row[".id"]);
            }
        }

    });
};

const eliminateRouterOSConfig = async (groupName) => {
    return new Promise(async (resolve, reject) => {
        logger.info("eliminateRouterOSConfig");
        await sleep(5000);
        try {
            await conn.connect();
            logger.info("Connected to host!");
        } catch (err){
            logger.info(`Error routeros failed to connect${err}`);
            resolve(`Error routeros failed to connect${err}`);
        }
        try {
            data = await conn.write("/interface/list/print", []);
            idRemove = await getIdToRemove(data, `LIST-${groupName}`);
            data = await conn.write("/interface/list/remove", [`=.id=${idRemove}`]);
            logger.info(`interface list name removed, ${data}`);
            data = await conn.write("/interface/wireguard/print", []);
            idRemove = await getIdToRemove(data, `WG-${groupName}`);
            data = await conn.write("/interface/wireguard/remove", [`=.id=${idRemove}`]);
            logger.info(`interface wireguard removed, ${data}`);
            data = await conn.write("/interface/wireguard/peers/print", []);
            idRemove = await getIdToRemove(data, `WG-${groupName}`);
            data = await conn.write("/interface/wireguard/peers/remove", [`=.id=${idRemove}`]);
            logger.info(`interface wireguard peers removed, ${data}`);
            data = await conn.write("/interface/vlan/print", []);
            idRemove = await getIdToRemove(data, `VLAN-${groupName}`);
            data = await conn.write("/interface/vlan/remove", [`=.id=${idRemove}`]);
            logger.info(`interface vlan removed, ${data}`);
            data = await conn.write("/ip/vrf/print", []);
            idRemove = await getIdToRemove(data, `VRF-${groupName}`);
            data = await conn.write("/ip/vrf/remove", [`=.id=${idRemove}`]);
            logger.info(`ip vrf removed, ${data}`);
            data = await conn.write("/interface/list/member/print", []);
            idRemove = await getIdToRemove(data, `VLAN-${groupName}`);
            data = await conn.write("/interface/list/member/remove", [`=.id=${idRemove}`]);
            logger.info(`interface list member vlan removed, ${data}`);
            data = await conn.write("/interface/list/member/print", []);
            idRemove = await getIdToRemove(data, `WG-${groupName}`);
            data = await conn.write("/interface/list/member/remove", [`=.id=${idRemove}`]);
            logger.info(`interface list member wireguard removed, ${data}`);
            data = await conn.write("/ip/address/print", []);
            idRemove = await getIdToRemove(data, `VLAN-${groupName}`);
            data = await conn.write("/ip/address/remove", [`=.id=${idRemove}`]);
            logger.info(`ip address vlan removed, ${data}`);
            data = await conn.write("/ip/address/print", []);
            idRemove = await getIdToRemove(data, `WG-${groupName}`);
            data = await conn.write("/ip/address/remove", [`=.id=${idRemove}`]);
            logger.info(`ip address wireguard removed, ${data}`);
            data = await conn.write("/ip/firewall/filter/print", []);
            idRemove = await getIdToRemove(data, `defconf: accept from ${groupName} to ${groupName}`);
            data = await conn.write("/ip/firewall/filter/remove", [`=.id=${idRemove}`]);
            logger.info(`ip firewall filter removed, ${data}`);
            logger.info(`closing connection routeros...`);
            data = await conn.close();
            resolve("Success");
        } catch (err){
            logger.info(`Error eliminating router config in execution ${err}`);
            logger.info(`closing connection routeros...`);
            data = await conn.close();
            reject();
        }
    });
};
//generateRouterOSConfig('XX-2022-2-111', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 65439, "ether1",13)
//eliminateRouterOSConfig("XX-2022-2-100");

module.exports = {
    generateRouterOSConfig,
    eliminateRouterOSConfig,
};

