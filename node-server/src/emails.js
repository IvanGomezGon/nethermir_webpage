const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
var logger = require(path.resolve(__dirname, 'logger.js'))
const {genKeyPairVLAN} = require(path.resolve(__dirname, 'database.js'))



const sendEmail = async (sendTo, txt, attachements = [{}]) => {
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
        attachments: attachements    
    })
    logger.info("Message sent to: " + sendTo, "Info: ", info);
}

const sendWarningMail = (user) =>{
    //Query for group email
    emails = ["ivangg02@gmail.com", "ivangg1202@gmail.com"]
    emailText = `Bon dia, la vostra VM serà apagada en 30 minuts
                `
    emails.forEach(email => sendEmail(email, emailText))
}
const sendPasswordEmail = (emails, groupName, idgroup, password) => {
    logger.info(id)
    [keyPairUser, keyPairRouter] = genKeyPairVLAN(idgroup)
    emailText = `Hola, les credencials per entrar al panell de gestió de Nethermir son: <br>
                Usuari: ${groupName} <br>
                Contransenya: ${password} <br><br>
                Adjunt a aquest correu trobareu: <br>
                    1. El manual per conectar-vos a la vostra màquina Nethermir a través de la VPN <br>
                    2. Les credencials d'accès a la VPN <br><br>
                `
    logger.info(emailText)
    wireguardTxtPath = `${process.env.FOLDER_CONFIGURATION_WIREGUARD_FILEPATH}${groupName}.txt`
    wireguardTxt = `
    interfaceAdr: 10.1.1.2/30 
    allowedIPs:  10.1.1.0/30  10.0.2.0/30 
    endpoint: 158.109.79.32:${65434+idgroup} 
    pubkey ROUTER: ${keyPairRouter.pub} 
    privkey USUARI:${keyPairUser.prv}`

    attachements = [
        {   filename: 'instructions.pdf',
            path: process.env.PDF_WIREGUARD_FILEPATH
        },
        {   filename: `${nameGroup}.txt`,
            path: wireguardTxtPath
        }] 

    fs.writeFile(wireguardTxtPath, wireguardTxt, function (err){
        if (err){logger.info(err)}
        emails.forEach(email=>{ sendEmail(email, emailText, attachements) })
    })
}

module.exports = {
    sendWarningMail,
    sendPasswordEmail
 }