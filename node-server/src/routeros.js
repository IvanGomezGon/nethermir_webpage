const RosApi = require('node-routeros').RouterOSAPI

const conn = new RosApi({
    host: '192.168.1.50',
    user: 'admin',
    password: '',
});
conn.connect()
    .then(() => {
        // Connection successful
        // Let's add an IP address to ether2
        conn.write('/ip/address/add', [
            '=interface=ether2',
            '=address=192.168.90.1',
        ])
        console.log("Done")

})