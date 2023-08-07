const RosApi = require('node-routeros').RouterOSAPI
const path = require('path');
var logger = require(path.resolve(__dirname, 'logger.js'))

const conn = new RosApi({
    host: process.env.ROUTEROS_HOST,
    user: process.env.ROUTEROS_USER,
    password: process.env.ROUTEROS_PASSWORD,
});



const newVLAN = (groupName, wgGroupName, wgGroupPublicKey, port_udp, vlanGroup) => {
    conn.connect()
    .then(() => {
        conn.write('/interface/list/add', [
            `=name=${groupName}`,
        ])
            .then((data) =>{
                logger.info(`interface list name added, ${data}`)
                return conn.write('/interface/wireguard/add', [
                    `=comment=${groupName}`,
                    `=listen-port=${port_udp}`,
                    `=mtu=1420`,
                    `=name=${wgGroupName}`,
                ])
            })
 
            .then((data) =>{
                logger.info(`interface wireguard added, ${data}`)
                return conn.write('/interface/wireguard/peers/add', [
                    `=allowed-address=10.0.1.0/30,10.1.1.0/30`,
                    `=comment=${groupName}`,
                    `=interface=wireguard_${wgGroupName}`,
                    `=public-key=${wgGroupPublicKey}`,
                ])
            })

            .then((data) =>{
                logger.info(`interface wireguard peers added, ${data}`)
                return conn.write('/interface/vlan/add', [
                    `=comment=${groupName}`,
                    `=interface=ether3`,
                    `=name=vlan_${vlanGroup}`,
                    `=vlan-id=${vlanGroup}`,
                ])
            })

            .then((data) =>{
                logger.info(`interface vlan added, ${data}`)
                return conn.write('/ip/vrf/add', [
                    `=interfaces=${groupName}`,
                    `=name=vrf_${groupName}`,
                ])
            })

            .then((data) =>{
                logger.info(`ip vrf added, ${data}`)
                return conn.write('/interface/list/member/add', [
                    `=interface=vlan_${vlanGroup}`,
                    `=list=${groupName}`,
                ])
            })

            .then((data) =>{
                logger.info(`interface list member vlan added, ${data}`)
                return conn.write('/interface/list/member/add', [
                    `=interface=wireguard_${wgGroupName}`,
                    `=list=${groupName}`,
                ])
            })

            .then((data) =>{
                logger.info(`interface list member wireguard added, ${data}`)
                return conn.write('/ip/address/add', [
                    `=address=10.0.1.1/30`,
                    `=comment=vlan_${vlanGroup}`,
                    `=interface=vlan_${vlanGroup}`,
                    `=network=10.0.1.0`,
                ])
            })

            .then((data) =>{
                logger.info(`ip address vlan added, ${data}`)
                return conn.write('/ip/address/add', [
                    `=address=10.1.1.1/30`,
                    `=comment=wireguard_${wgGroupName}`,
                    `=interface=wireguard_${wgGroupName}`,
                    `=network=10.1.1.0`,
                ])
            })

            .then((data) =>{
                logger.info(`ip address wireguard added, ${data}`)
                return conn.write('/ip/firewall/filter/add', [
                    `=action=accept`,
                    `=chain=forward`,
                    `=comment="defconf: accept from ${groupName} to ${groupName}"`,
                    `=in-interface-list=${groupName}`,
                    `=out-interface-list=${groupName}`,

                ])
            })

            .catch((err) =>{
                logger.info(`Error routeros${err}`)
            })

})

}

module.exports = {
    newVLAN,
 }