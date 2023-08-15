const RosApi = require('node-routeros').RouterOSAPI
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
var logger = require(path.resolve(__dirname, 'logger.js'))

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
    conn.connect()
    .then(() => {
        conn.write('/interface/list/add', [
            `=name=LIST-${groupName}`,
        ])
            .then((data) =>{
                console.log(`interface list name added, ${data}`)
                return conn.write('/interface/wireguard/add', [
                    `=comment=WG-${groupName}`,
                    `=listen-port=${port_udp}`,
                    `=mtu=1420`,
                    `=name=WG-${groupName}`,
                    `=private-key=${wgRouterPrivateKey}`
                ])
            })

            .then((data) =>{
                console.log(`interface vlan added, ${data}`)
                return conn.write('/interface/wireguard/peers/add', [
                    `=allowed-address=10.0.1.0/30,10.1.1.0/30`,
                    `=comment=WG-${groupName}`,
                    `=interface=WG-${groupName}`,
                    `=public-key=${wgGroupPublicKey}`,
                ])
            })

            .then((data) =>{
                console.log(`interface wireguard peers added, ${data}`)
                return conn.write('/interface/vlan/add', [
                    `=comment=VLAN-${groupName}`,
                    `=interface=${interface}`,
                    `=name=VLAN-${groupName}`,
                    `=vlan-id=${vlanId}`,
                ])
            })

            .then((data) =>{
                console.log(`interface vlan added, ${data}`)
                return conn.write('/ip/vrf/add', [
                    `=interfaces=WG-${groupName},VLAN-${groupName}`,
                    `=name=VRF-${groupName}`,
                ])
            })

            .then((data) =>{
                console.log(`ip vrf added, ${data}`)
                return conn.write('/interface/list/member/add', [
                    `=interface=VLAN-${groupName}`,
                    `=list=LIST-${groupName}`,
                ])
            })

            .then((data) =>{
                console.log(`interface list member vlan added, ${data}`)
                return conn.write('/interface/list/member/add', [
                    `=interface=WG-${groupName}`,
                    `=list=LIST-${groupName}`,
                ])
            })

            .then((data) =>{
                console.log(`interface list member wireguard added, ${data}`)
                return conn.write('/ip/address/add', [
                    `=address=10.0.1.1/30`,
                    `=comment=VLAN-${groupName}`,
                    `=interface=VLAN-${groupName}`,
                    `=network=10.0.1.0`,
                ])
            })

            .then((data) =>{
                console.log(`ip address vlan added, ${data}`)
                return conn.write('/ip/address/add', [
                    `=address=10.1.1.1/30`,
                    `=comment=WG-${groupName}`,
                    `=interface=WG-${groupName}`,
                    `=network=10.1.1.0`,
                ])
            })

            .then((data) =>{
                console.log(`ip address wireguard added, ${data}`)
                return conn.write('/ip/firewall/filter/add', [
                    `=action=accept`,
                    `=chain=forward`,
                    `=comment="defconf: accept from ${groupName} to ${groupName}"`,
                    `=in-interface-list=LIST-${groupName}`,
                    `=out-interface-list=LIST-${groupName}`,

                ])
            })
            .then((data) => {
                console.log(`ip firewall filter added, ${data}`);
                console.log(`closing connection routeros...`)
                conn.close();
            })
            .catch((err) =>{
                console.log(`Error routeros${err}`)
                console.log(`closing connection routeros...`)
                conn.close();
            })

}) .catch((err) =>{
    console.log(`Error routeros${err}`)
})

}
generateRouterOSConfig('XX-2022-2-300', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 'd6RkghbowFsH8hafgjMeTWnsfZIZVJMGXr6toVd2jxU=', 65439, 'ether1', 300)
module.exports = {
    generateRouterOSConfig,
 }