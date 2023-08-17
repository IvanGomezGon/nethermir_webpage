const path = require("path");
const fs = require("fs");
const nodeMailer = require("nodemailer");
const JSZip = require("jszip");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
var logger = require(path.resolve(__dirname, "logger.js"));

const sendEmail = (sendTo, txt, attachements = [{}]) => {
    logger.info("SendEmail started");
    return new Promise((resolve, reject) => {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: false,
        });
        mailOptions = {
            from: process.env.SMTP_ORIGIN,
            to: sendTo,
            subject: "Config wireguard",
            html: txt,
            attachments: attachements,
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {logger.error(`Error sending email ${err}`)}
            logger.info(`Message sent to: ${sendTo} Info: ${info}`);
            resolve();
        });
    });
};

const sendWarningMail = (user) => {
    //TODO: EMAILS CHANGES, EMAIL TEXT
    emails = ["ivangg02@gmail.com", "ivangg1202@gmail.com"];
    emailText = `Bon dia, la vostra VM serà apagada en 30 minuts
                `;
    emails.forEach((email) => sendEmail(email, emailText));
};
const sendPasswordEmail = async (emails, groupName, endpointPort, password, keyPairUser, keyPairRouter) => {
    logger.info("sendPasswordEmail");
    emailText = `Hola, les credencials per entrar al panell de gestió de Nethermir son: <br>
                Usuari: ${groupName} <br>
                Contransenya: ${password} <br><br>
                Adjunt a aquest correu trobareu: <br>
                    1. El manual per conectar-vos a la vostra màquina Nethermir a través de la VPN <br>
                    2. Les credencials d'accès a la VPN <br><br>
                `;
    wireguardTxtPath = `/tmp/${groupName}.zip`;
    wireguardTxt = `
    [Interface]
    PrivateKey = ${keyPairUser.prv}
    Address = 10.1.1.2/30

    [Peer]
    PublicKey = ${keyPairRouter.pub}
    AllowedIPs = 10.1.1.0/30, 10.0.1.0/30
    Endpoint = 158.109.79.32:${endpointPort}
    PersistentKeepalive = 30`;

    attachements = [
        {
            filename: "instructions.pdf",
            path: process.env.PDF_WIREGUARD_FILEPATH,
        },
        { filename: `${nameGroup}.zip`, path: wireguardTxtPath },
    ];
    logger.info(`Attachements: ${attachements}`);
    const zip = new JSZip();
    zip.file(`${groupName}.conf`, wireguardTxt);
    const content = await zip.generateAsync({ type: "nodebuffer" });
    logger.info(`Content: ${content}`);
    fs.writeFile(`/tmp/${groupName}.zip`, content, async (err) => {
        if (err) {
            logger.error(`Error creating zip ${err}`);
        }
        logger.info(`.zip created, sending emails...`);
        for (const email of emails) {
            logger.info(`Email ${email}`);
            await sendEmail(email, emailText, attachements);
        }
        logger.info("Sending finished, unlinking");
        fs.unlink(`/tmp/${groupName}.zip`, (err) => {
            if (err) {
                logger.error(`Error eliminating zip ${err}`);
            }
            logger.info("Unlinking ended");
        });
    });
};

module.exports = {
    sendWarningMail,
    sendPasswordEmail,
};
