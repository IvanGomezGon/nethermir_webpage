const RosApi = require('node-routeros').RouterOSAPI
const winston = require('winston')
const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log'}),
        new winston.transports.Console({format: winston.format.simple()})
    ],
})
const conn = new RosApi({
    host: process.env.ROUTEROS_HOST,
    user: process.env.ROUTEROS_USER,
    password: process.env.ROUTEROS_PASSWORD,
});
conn.connect()
    .then(() => {
        // Connection successful
        // Let's add an IP address to ether2
        conn.write('/ip/address/add', [
            '=interface=ether2',
            '=address=192.168.90.1',
        ])
        logger.info("Done")

})