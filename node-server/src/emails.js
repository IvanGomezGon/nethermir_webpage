const path = require('path');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const sendEmail = async (sendTo, txt) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }  
    });
    const info = await transporter.sendMail({
        from: 'UAB <ivangg02@gmail.com>',
        to: sendTo,
        subject: 'Config wireguard ',
        html: txt,           
    })
    console.log("Message sent to: " + sendTo);
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
    console.log(id)
    keyPair_user = genKeyPair()
    keyPair_server = genKeyPair()
    emailText = `Bon dia grup ${nameGroup}, la vostra contrasenya serà: ${password} 
                interfaceAdr: 10.1.${id}.2/30
                allowedIPs:  10.1.${id}.2/30  10.0.${id}.0/30
                endpoint: 158.109.79.32:${38980+id}
                pubkey: ${keyPair_server.pub}
                privkey:${keyPair_user.prv}`
    //TODO: save db key_pair privs 
    console.log(emailText)
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