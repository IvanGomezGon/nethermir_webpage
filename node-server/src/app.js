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
    cookieManager.getUserCookie(req, res)
        .then((groupName) => feedbackFetch(groupName, res))
        .catch(() => logger.info("cookieManager.checkCookie failed"));
});

app.post("/backend/machine", async function (req, res) {
    try {
        groupName = await cookieManager.getUserCookie(req, res);
        logger.info(`Generating VM: ${groupName}`)
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

app.get("/backend/login", async function (req, res) {
    try{
        user = req.query["user"]
        const password = req.query["password"]
        logger.info(`Logging: ${user}`)
        user = await databaseManager.authenticate(user, password)
        cookieManager.setCookie(user, res);
    }catch (error) {
        logger.error(`Failed loging ${error}`)
    }
});

app.post("/backend/register", async function (req, res) {
    try {
        let user = req.body["user"]
        let emailsRaw = req.body["emails"]
        let [groupName, emails, portUDP, password, keyPairUser, keyPairRouter] = await databaseManager.registerGroup(user, emailsRaw);
        logger.info(`Register: ${groupName}`)
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
        await cookieManager.checkIsRootCookie(req, res)
        proxmoxManager.getStatusAllVMs(server).then(status => feedbackFetch(status, res))
    } catch (error) {
        logger.error(`Error gettingStatusAllVMs ${error}`)
    }

});

app.get("/backend/statusVM", async function (req, res) {
    try {
        const vmID = req.query["vmID"]
        groupName = await cookieManager.getUserCookie(req, res)
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
        groupName = await cookieManager.getUserCookie(req, res)
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
        await cookieManager.checkIsRootCookie(req, res)
        databaseManager.getGroups(res).then(groups => feedbackFetch(groups, res))
    } catch (error) {
        logger.error(`Error getting groups ${error}`)
    }

});

app.delete("/backend/group", async function (req, res) {
    try {
        await cookieManager.checkIsRootCookie(req, res);
        logger.info(`Eliminating groups: ${req.query["groupID"]}`)
        groupNames = req.query["groupID"].split(',');
        groupNames.forEach(async groupName => {
            let groupID = groupName.split('-').pop()
            await databaseManager.eliminateGroup(groupID);
            proxmoxManager.eliminateMachine(groupID)
            routerosManager.eliminateRouterOSConfig(groupName)
        })
    } catch (error) {
        logger.error(`Error eliminating group ${error}`)
    }
});

app.get("/backend/emails", async function (req, res) {
    try {
        await cookieManager.checkIsRootCookie(req, res)
        databaseManager.getEmails(res).then(emails => feedbackFetch(emails, res))
    } catch (error) {
        logger.error(`Error getting Emails ${error}`)
    }
});

app.delete("/backend/email", async function (req, res) {
    try {
        await cookieManager.checkIsRootCookie(req, res)
        logger.info(`Eliminating emails: ${req.query["emailID"]}`)
        const emailsID = req.query["emailID"].split(',')
        let promises = [];
        emailsID.forEach(emailID => {
            logger.info(`emailid ${emailID}`)
            promises.push(databaseManager.eliminateEmail(emailID, res))
        })
        Promise.all(promises).then(feedbackFetch(" ", res));
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
        logger.info(`Adding subject: ${subjectName}`)
        await cookieManager.checkIsRootCookie(req, res)
        databaseManager.addSubject(subjectName, subjectID).then(feedbackFetch(" ", res))
    } catch (error) {
        logger.error(`Error adding subject ${error}`)
    }
});

app.delete("/backend/subject", async function (req, res) {
    try {
        await cookieManager.checkIsRootCookie(req, res)
        logger.info(`Eliminating subjects: ${req.query["subjectIDs"]}`)
        const subjectIDs = req.query["subjectIDs"].split(',')
        let promises = [];
        subjectIDs.forEach(subjectID => {
            promises.push(databaseManager.eliminateSubject(subjectID))
        })
        Promise.all(promises).then(feedbackFetch("", res));
    } catch (error) {
        logger.error(`Failed to eliminateSubject ${error}`)
    }
});

app.put("/backend/activateSubject", async function (req, res) {
    logger.info("activateSubject");
    try {
        await cookieManager.checkIsRootCookie(req, res)
        logger.info(`Activating subject: ${req.body["subjectIDs"]}`)
        const subjectIDs = req.body["subjectIDs"].split(',')
        let promises = [];
        subjectIDs.forEach(subjectID => {
            promises.push(databaseManager.activateSubject(subjectID))
        })
        Promise.all(promises).then(feedbackFetch("", res));
    } catch (error) {
        logger.error(`Failed activating subject ${error}`)
    }
});

app.put("/backend/deactivateSubject", async function (req, res) {
    logger.info("DeactivateSubject");
    try {
        await cookieManager.checkIsRootCookie(req, res)
        const subjectIDs = req.body["subjectIDs"].split(',')
        logger.info(`Deactivating subject: ${req.body["subjectIDs"]}`)
        let promises = [];
        subjectIDs.forEach(subjectID => {
            promises.push(databaseManager.deactivateSubject(subjectID))
        })
        Promise.all(promises).then(feedbackFetch("", res));
    } catch (error) {
        logger.error(`Failed deactivating subject ${error}`)
    }
});

app.delete("/backend/restartDatabase", async function (req, res) {
    logger.info("restartDatabase");
    try {
        logger.info(`Restarting database`)
        await cookieManager.checkIsRootCookie(req, res)
        databaseManager.restartDatabase().then(feedbackFetch("", res));
        
    } catch (error) {
        logger.error(`Failed restarting database ${error}`)
    }
});

app.put("/backend/activateMachine", async function (req, res) {
    try {
        const hours = req.body["hours"]
        groupName = await cookieManager.getUserCookie(req, res)
        vmIDs = [groupName.split("-").pop()]
        if (req.body["vmIDs"] != null) {
            vmIDs = req.body["vmIDs"].split(',') 
        }     
        logger.info(`activateMachine: ${vmIDs}`)
        if (vmIDs.length > 1){
            let promises = [];
            vmIDs.forEach(async vmID => {
                promises.push(proxmoxManager.activateMachine(vmID));
            })
            Promise.all(promises).then(feedbackFetch("", res));  
        }else{
            vmID = vmIDs[0]
            active = await proxmoxManager.getActiveVM(vmID);
            await databaseManager.changeRenovationHoursVM(vmID, active, hours);
            renovationHours = await databaseManager.getRenovationHoursVM(vmID)
            await proxmoxManager.activateMachine(vmID);
            emails = await databaseManager.getEmailsFromGroupName(vmID);
            setTimeout(async function () {
                if (await databaseManager.getRenovationHoursVM(vmID) == renovationHours) {
                    emailManager.sendWarningMail(emails);
                    setTimeout(async function () {
                        if (await databaseManager.getRenovationHoursVM(vmID) == renovationHours) {
                            proxmoxManager.stopMachine(vmID, req, res)
                        }
                    }, 1800000)
                }
            }, hours * 3600000 - 1800000);
        }       
    } catch (error) {
        logger.error(`Failed activating machines ${error}`)
    }
});

app.put("/backend/stopMachine", async function (req, res) {
    try {
        groupName = await cookieManager.getUserCookie(req, res)
        vmIDs = [groupName.split("-").pop()]
        if (req.body["vmIDs"] != null) {
            vmIDs = req.body["vmIDs"].split(',') 
        }        
        let promises = [];
        logger.info(`Stopping machines: ${vmIDs}`)
        vmIDs.forEach(async vmID => {
            promises.push(proxmoxManager.stopMachine(vmID));
        })
        Promise.all(promises).then(feedbackFetch("", res));  
    } catch (error) {
        logger.error(`Failed stopping machines ${error}`)
    }
});

app.put("/backend/resumeMachine", async function (req, res) {
    logger.info("resumeMachine");
    try {
        groupName = await cookieManager.getUserCookie(req, res)
        vmIDs = [groupName.split("-").pop()]
        logger.info(`Resuming machines: ${vmIDs}`)
        let promises = [];
        if (req.body["vmIDs"] != null) {
            vmIDs = req.body["vmIDs"].split(',') 
        }  
        vmIDs.forEach(async vmID => {
            promises.push(proxmoxManager.resumeMachine(vmID));
        })
        Promise.all(promises).then(feedbackFetch("", res));
    } catch (error) {
        logger.error(`Failed resuming machines ${error}`)
    }
});

app.put("/backend/suspendMachine", async function (req, res) {
    logger.info("suspendMachine");
    try {
        groupName = await cookieManager.getUserCookie(req, res)
        vmIDs = [groupName.split("-").pop()]
        if (req.body["vmIDs"] != null) {
            vmIDs = req.body["vmIDs"].split(',') 
        }  
        logger.info(`Suspending machines: ${vmIDs}`)
        let promises = [];
        vmIDs.forEach(async vmID => {
            if (vmID != null) {
                promises.push(proxmoxManager.suspendMachine(vmID));
            } else {
                promises.push(proxmoxManager.suspendMachine(groupName.split("-").pop()));
            }
        })
        Promise.all(promises).then(feedbackFetch("", res));
    } catch (error) {
        logger.error(`Failed suspending machines ${error}`)
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
        logger.info(`Deleting machines: ${req.body["vmIDs"]}`)
        groupName = await cookieManager.getUserCookie(req, res)
        if (vmID != null) {
            proxmoxManager.eliminateMachine(vmID);
        } else {
            proxmoxManager.eliminateMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed eliminating machines ${error}`)
    }
});

app.listen(port, () => logger.info(`App listening on port ${port}!`));
