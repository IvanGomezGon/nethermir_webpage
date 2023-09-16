const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    allowCredentials: true,
    exposedHeaders: ["set-cookie"],
};
const emailManager = require(path.resolve(__dirname, "emails.js"));
const proxmoxManager = require(path.resolve(__dirname, "proxmox.js"));
const databaseManager = require(path.resolve(__dirname, "database.js"));
const cookieManager = require(path.resolve(__dirname, "cookies.js"));
const routerosManager = require(path.resolve(__dirname, "routeros.js"));
const { feedbackFetch } = require(path.resolve(__dirname, "globalFunctions.js"));
var logger = require(path.resolve(__dirname, "logger.js"));

const app = express();
const port = process.env.SERVER_LISTEN_PORT;
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
// ALL BACKEND CALLS FROM FRONTEND

app.get("/backend/checkCookie", function (req, res) {
    logger.info("cookieManager.checkCookie");
    cookieManager.checkCookie(req, res)
        .then((groupName) => feedbackFetch(groupName, res))
        .catch(() => logger.info("cookieManager.checkCookie failed"));
});

app.put("/backend/activateMachine", async function (req, res) {
    logger.info("activateMachine started");
    try {
        const vmID = req.body["vmID"]
        const hours = req.body["hours"]
        groupName = await cookieManager.checkCookie(req, res)
        group = vmID != null ? group = vmID : group = groupName.split("-").pop()
        active = await proxmoxManager.getActiveVM(group);
        logger.info(`active: ${active}`)
        await databaseManager.changeRenovationHoursVM(group, active, hours);
        renovationHours = await databaseManager.getRenovationHoursVM(group)
        logger.info(`active: ${renovationHours}`)
        await proxmoxManager.activateMachine(group);
        emails = await databaseManager.getEmailsFromGroupName(group, vmID);
        setTimeout(async function () {
            if (await databaseManager.getRenovationHoursVM(group) == renovationHours) {
                emailManager.sendWarningMail(emails);
                setTimeout(async function () {
                    if (await databaseManager.getRenovationHoursVM(group) == renovationHours) {
                        proxmoxManager.stopMachine(group, req, res)
                    }
                }, 1800000)
            }
        }, hours * 3600000 - 1800000);
    } catch (error) {
        logger.error(`Failed activatingMachine ${error}`)
    }
});

app.post("/backend/machine", async function (req, res) {
    logger.info("generateMachine");
    try {
        groupName = await cookieManager.checkCookie(req, res);
        groupData = await databaseManager.getGroupData(groupName);
        if (groupData.active != 0) {
            feedbackFetch("Group Virtual Machine already created")
            return;
        }
        cloneRes = await proxmoxManager.cloneMachine(groupData.idgroup, groupName)
        bridge = process.env.PROXMOX_PUBLIC_BRIDGE
        proxmoxManager.modifyMachineVLAN(groupName, groupData.idgroup, bridge);
        portUDP = parseInt(process.env.PORT_UDP_FIRST_ID) + parseInt(groupData.vlan_id);
        databaseManager.activateGroup(groupData.idgroup);
        generateRes = await proxmoxManager.generateRouterOSConfig(user, groupData.private_key_router, groupData.public_key_user, portUDP, process.env.ROUTEROS_TO_PROXMOX_INTERFACE_NAME, groupData.idgroup);
        if (generateRes == "Success") {
            feedbackFetch(groupName, res);
        } else {
            eliminateRes = await proxmoxManager.eliminateRouterOSConfig(groupName);
            feedbackFetch("Generating router config failed - Contact Professor", res)
        }
    } catch (error) {
        logger.error(`Failed generatingMachine ${error}`)
    }
});

app.put("/backend/stopMachine", async function (req, res) {
    logger.info("stopMachine");
    try {
        const vmID = req.body["vmID"]
        groupName = await cookieManager.checkCookie(req, res)
        if (vmID != null) {
            proxmoxManager.stopMachine(vmID, req, res);
        } else {
            proxmoxManager.stopMachine(groupName.split("-").pop(), req, res);
        }
    } catch (error) {
        logger.error(`Failed stopingMachine ${error}`)
    }
});

app.get("/backend/login", async function (req, res) {
    logger.info("login");
    try{
        user = req.query["user"]
        const password = req.query["password"]
        user = await databaseManager.authenticate(user, password)
        cookieManager.setCookie(user, res);
    }catch (error) {
        logger.error(`Failed loging ${error}`)
    }
});

app.post("/backend/register", async function (req, res) {
    logger.info("register");
    try {
        let user = req.body["user"]
        let emailsRaw = req.body["emails"]
        let [groupName, emails, portUDP, password, keyPairUser, keyPairRouter] = await databaseManager.registerGroup(user, emailsRaw);
        emailManager.sendPasswordEmail(emails, groupName, portUDP, password, keyPairUser, keyPairRouter);
        feedbackFetch("success", res)
    } catch (error) {
        logger.error(`Error register group ${error}`)
        feedbackFetch(`Error: ${error}`, res)
    }
});

app.get("/backend/statusAllVMs", async function (req, res) {
    try {
        const server = req.query["server"]
        await cookieManager.checkCookie(req, res)
        proxmoxManager.getStatusAllVMs(server).then(status => feedbackFetch(status, res))
    } catch (error) {
        logger.error(`Error gettingStatusAllVMs ${error}`)
    }

});

app.get("/backend/statusVM", async function (req, res) {
    try {
        const vmID = req.query["vmID"]
        groupName = await cookieManager.checkCookie(req, res)
        if (vmID != null) {
            proxmoxManager.getStatusVM(vmID).then(status => feedbackFetch(JSON.stringify(status), res))
        } else {
            proxmoxManager.getStatusVM(groupName.split("-").pop()).then(status => feedbackFetch(JSON.stringify(status), res))
        }
    } catch (error) {
        logger.error(`Failed gettingStatusVM ${error}`)
    }
});

app.get("/backend/startingTimeVM", async function (req, res) {
    try {
        const vmID = req.query["vmID"]
        groupName = await cookieManager.checkCookie(req, res)
        if (vmID != null) {
            databaseManager.getStartingTimeVM(vmID).then(startingTime => feedbackFetch(startingTime, res))
        } else {
            databaseManager.getStartingTimeVM(groupName.split("-").pop()).then(startingTime => feedbackFetch(startingTime, res))
        }
    } catch (error) {
        logger.error(`Failed gettingStartingTimeVM ${error}`)
    }

});

app.get("/backend/groups", async function (req, res) {
    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.getGroups(res).then(groups => feedbackFetch(groups, res))
    } catch (error) {
        logger.error(`Error getting groups ${error}`)
    }

});

app.delete("/backend/group", async function (req, res) {
    logger.info("eliminateGroup");
    try {
        groupID = req.query["groupID"]
        groupName = await cookieManager.checkCookie(req, res);
        await databaseManager.eliminateGroup(groupID);
        proxmoxManager.eliminateMachine(groupName.split("-").pop())
        routerosManager.eliminateRouterOSConfig(groupName)
    } catch (error) {
        logger.error(`Error eliminating group ${error}`)
    }
});

app.get("/backend/emails", async function (req, res) {
    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.getEmails(res).then(emails => feedbackFetch(emails, res))
    } catch (error) {
        logger.error(`Error getting Emails ${error}`)
    }
});

app.delete("/backend/email", async function (req, res) {
    logger.info("eliminateEmail");
    try {
        const emailID = req.query["emailID"]
        await cookieManager.checkCookie(req, res)
        databaseManager.eliminateEmail(emailID, res).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Error eliminating Email ${error}`)
    }
});

app.get("/backend/subjects", async function (req, res) {
    try {
        subjects = await databaseManager.getSubjects(res);
        feedbackFetch(subjects, res)
    } catch (error) {
        logger.error(`Failed gettingSubjects ${error}`)
    }
});

app.post("/backend/subject", async function (req, res) {
    logger.info("addSubject");
    try {
        const subjectName = req.body["subjectName"]
        const subjectID = req.body["subjectID"]
        await cookieManager.checkCookie(req, res)
        databaseManager.addSubject(subjectName, subjectID).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Error adding subject ${error}`)
    }
});

app.delete("/backend/subject", async function (req, res) {
    logger.info("eliminateSubject");
    try {
        const subjectID = req.query["subjectID"]
        await cookieManager.checkCookie(req, res)
        databaseManager.eliminateSubject(subjectID).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Failed to eliminateSubject ${error}`)
    }
});

app.put("/backend/activateSubject", async function (req, res) {
    logger.info("activateSubject");
    try {
        const subjectID = req.body["subjectID"]
        await cookieManager.checkCookie(req, res)
        databaseManager.activateSubject(subjectID).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Failed activating machine ${error}`)
    }

});

app.delete("/backend/restartDatabase", async function (req, res) {
    logger.info("restartDatabase");
    try {
        groupName = await cookieManager.checkCookie(req, res)
        if (groupName == "root") {
            databaseManager.restartDatabase().then(feedbackFetch("", res));
        }
    } catch (error) {
        logger.error(`Failed restartingDatabase ${error}`)
    }
});

app.put("/backend/resumeMachine", async function (req, res) {
    logger.info("resumeMachine");
    try {
        const vmID = req.body["vmID"]
        groupName = await cookieManager.checkCookie(req, res)
        if (vmID != null) {
            proxmoxManager.resumeMachine(vmID);
        } else {
            proxmoxManager.resumeMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed resumingMachine ${error}`)
    }
});

app.put("/backend/suspendMachine", async function (req, res) {
    logger.info("suspendMachine");
    try {
        const vmID = req.body["vmID"]
        groupName = await cookieManager.checkCookie(req, res)
        if (vmID != null) {
            proxmoxManager.suspendMachine(vmID);
        } else {
            proxmoxManager.suspendMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed suspendingMachine ${error}`)
    }
});

app.delete("/backend/cookie", function (req, res) {
    logger.info("eliminateCookie");
    cookieManager.eliminateCookie(res);
});

app.delete("/backend/machine", async function (req, res) {
    logger.info("eliminateMachine");
    try {
        const vmID = req.body["vmID"]
        groupName = await cookieManager.checkCookie(req, res)
        if (vmID != null) {
            proxmoxManager.eliminateMachine(vmID);
        } else {
            proxmoxManager.eliminateMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed eliminathingMachine ${error}`)
    }
});

app.listen(port, () => logger.info(`App listening on port ${port}!`));
