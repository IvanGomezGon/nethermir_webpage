const path = require("path");
const fs = require("fs");
const nodeMailer = require("nodemailer");
const JSZip = require("jszip");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
var logger = require(path.resolve(__dirname, "logger.js"));

const sendEmail = (sendTo, txt, subject, attachements = null) => {
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
            subject: subject,
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

const sendWarningMail = (emails) => {
    var emailText = `Atenció, la concessió de temps de la vostra màquina virtual a Nethermir caduca en 30 minuts. <br>
                Si voleu continuar treballant amb la màquina virtual heu d'entrar a l'entorn de gestió, https://nethermir.uab.cat/, i estendre la vostra reserva de temps. <br>
                En canvi, si heu acabat de treballar amb la màquina virtual, podeu ignorar aquest missatge i la màquina s'aturarà automàticament passat el temps. <br>
                Salutacions, Nethermir`;
    emails.forEach((email) => sendEmail(email.email, emailText, "Notificació apagament Màquina Virtual"));
};
const sendPasswordEmail = async (emails, groupName, endpointPort, password, keyPairUser, keyPairRouter) => {
    logger.info(`sendPasswordEmail ${groupName}`);
    var emailText = `Hola, les credencials per entrar al panell de gestió de Nethermir son: <br>
                Usuari: ${groupName} <br>
                Contransenya: ${password} <br><br>
                Adjunt a aquest correu trobareu: <br>
                    1. El manual per conectar-vos a la vostra màquina Nethermir a través de la VPN <br>
                    2. Les credencials d'accès a la VPN <br><br>
                Salutacions, <br> 
                Nethermir
                `;
    var wireguardTxtPath = `/tmp/${groupName}.zip`;
    var wireguardTxt = `
    [Interface]
    PrivateKey = ${keyPairUser.prv}
    Address = 10.1.1.2/30

    [Peer]
    PublicKey = ${keyPairRouter.pub}
    AllowedIPs = 10.1.1.0/30, 10.0.1.0/30
    Endpoint = 158.109.79.32:${endpointPort}
    PersistentKeepalive = 30`;

    var attachements = [
        {
            filename: "instructions.pdf",
            path: process.env.PDF_WIREGUARD_FILEPATH,
        },
        { filename: `${groupName}.zip`, path: wireguardTxtPath },
    ];
    logger.info(`Attachements: ${attachements}`);
    const zip = new JSZip();
    zip.file(`${groupName}.conf`, wireguardTxt);
    const content = await zip.generateAsync({ type: "nodebuffer" });
    fs.writeFile(`/tmp/${groupName}.zip`, content, async (err) => {
        if (err) {
            logger.error(`Error creating zip ${err}`);
        }
        logger.info(`.zip created, sending emails...`);
        for (const email of emails) {
            logger.info(`Email ${email}`);
            await sendEmail(email, emailText, "Config wireguard", attachements);
        }
        logger.info("Sending finished, unlinking");
        fs.unlink(`/tmp/${groupName}.zip`, (err) => {
            if (err) {
                logger.error(`Error deleting zip ${err}`);
            }
            logger.info("Unlinking ended");
        });
    });
};

module.exports = {
    sendWarningMail,
    sendPasswordEmail,
};
