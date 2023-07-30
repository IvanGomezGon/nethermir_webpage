const path = require('path');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
var {logger} = require(path.resolve(__dirname, 'logger.js'))


const sendEmail = async (sendTo, txt) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: false
    });
    const info = await transporter.sendMail({
        from: process.env.SMTP_ORIGIN,
        to: sendTo,
        subject: 'Config wireguard ',
        html: txt,           
    })
    logger.info("Message sent to: " + sendTo);
}

const sendWarningMail = (user) =>{
    //Query for group email
    emails = ["ivangg02@gmail.com", "ivangg1202@gmail.com"]
    emailText = `Bon dia, la vostra VM serà apagada en 30 minuts
                `
    emails.forEach(email => sendEmail(email, emailText))
}
const sendPasswordEmail = (emails, nameGroup, idgroup, password) => {
    id = idgroup
    logger.info(id)
    keyPair_user = genKeyPair()
    keyPair_server = genKeyPair()
    emailText = `Hola, les credencials per entrar al panell de gestió de Nethermir son: 
                Usuari: ${nameGroup} 
                Contransenya: ${password} 
                Adjunt a aquest correu trobareu:
                    1. El manual per conectar-vos a la vostra màquina Nethermir a través de la VPN
                    2. Les credencials d'accès a la VPN
                
                //FITXER//
                interfaceAdr: 10.1.1.2/30
                allowedIPs:  10.1.1.0/30  10.0.2.0/30
                endpoint: 158.109.79.32:${65434+id}
                pubkey ROUTER: ${keyPair_server.pub}
                privkey USUARI:${keyPair_user.prv}`
    //TODO: save db key_pair privs 
    logger.info(emailText)
    emails.forEach(email=>{ sendEmail(email, emailText) })

}

const genKeyPair = () => {
    let k = crypto.generateKeyPairSync("x25519", {
        publicKeyEncoding: { format: "der", type: "spki" },
        privateKeyEncoding: { format: "der", type: "pkcs8" }
    });

    return {
        pub: k.publicKey.subarray(12).toString("base64"),
        prv: k.privateKey.subarray(16).toString("base64")
    };
};


module.exports = {
    sendWarningMail,
    sendPasswordEmail
 }