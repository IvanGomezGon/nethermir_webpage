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

// ALL BACKEND CALLS FROM FRONTEND

app.get("/backend/checkCookie", function (req, res) {
    logger.info("cookieManager.checkCookie");
    cookieManager.checkCookie(req, res)
        .then((groupName) => feedbackFetch(groupName, res))
        .catch(() => logger.info("cookieManager.checkCookie failed"));
});
app.get("/backend/activateMachine", async function (req, res) {
    try {
        logger.info("activateMachine started");
        groupName = await cookieManager.checkCookie(req, res)
        group = req.query["id"] != null ? group = req.query["id"] : group = groupName.split("-").pop()
        active = await proxmoxManager.getActiveVM(group);
        logger.info(`active: ${active}`)
        await databaseManager.changeRenovationHoursVM(group, active, req.query["hours"]);
        renovationHours = await databaseManager.getRenovationHoursVM(group)
        logger.info(`active: ${renovationHours}`)
        await proxmoxManager.activateMachine(group);
        emails = await databaseManager.getEmailsFromGroupName(group, req.query["id"]);
        setTimeout(async function () {
            if (await databaseManager.getRenovationHoursVM(group) == renovationHours) {
                emailManager.sendWarningMail(emails);
                setTimeout(async function () {
                    if (await databaseManager.getRenovationHoursVM(group) == renovationHours) {
                        proxmoxManager.stopMachine(group, req, res)
                    }
                }, 1800000)
            }
        }, req.query["hours"] * 3600000 - 1800000);
    } catch (error) {
        logger.error(`Failed activatingMachine ${error}`)
    }
});

app.get("/backend/generateMachine", async function (req, res) {
    logger.info("generateMachine");
    try {
        groupName = await cookieManager.checkCookie(req, res);
        groupData = await getGroupData(groupName);
        if (groupData.active != 0) {
            feedbackFetch("Group Virtual Machine already created")
            return;
        }
        cloneRes = await proxmoxManager.cloneMachine(groupData.idgroup, groupName)
        bridge = process.env.PROXMOX_PUBLIC_BRIDGE
        proxmoxManager.modifyMachineVLAN(groupName, groupData.idgroup, bridge, req, res);
        portUDP = parseInt(process.env.PORT_UDP_FIRST_ID) + parseInt(groupData.vlan_id);
        databaseManager.activateGroup(groupData.idgroup);
        generateRes = await generateRouterOSConfig(user, groupData.private_key_router, groupData.public_key_user, portUDP, process.env.ROUTEROS_TO_PROXMOX_INTERFACE_NAME, groupData.idgroup);
        if (generateRes == "Success") {
            feedbackFetch(groupName, res);
        } else {
            eliminateRes = await eliminateRouterOSConfig(groupName);
            feedbackFetch("Generating router config failed - Contact Professor", res)
        }
    } catch (error) {
        logger.error(`Failed generatingMachine ${error}`)
    }
});

app.get("/backend/stopMachine", async function (req, res) {
    logger.info("stopMachine");
    try {
        groupName = await cookieManager.checkCookie(req, res)
        if (req.query["id"] != null) {
            proxmoxManager.stopMachine(req.query["id"], req, res);
        } else {
            proxmoxManager.stopMachine(groupName.split("-").pop(), req, res);
        }
    } catch (error) {
        logger.error(`Failed stopingMachine ${error}`)
    }

});

//TODO: REFACTOR
app.get("/backend/login", function (req, res) {
    logger.info("login");
    databaseManager.authenticate(req.query["user"], req.query["pass"])
        .then((x) => {
            cookieManager.setCookie(x, res);
        })
        .catch((x) => {
            logger.info(`Failed to login ${x}`);
        });
});
app.get("/backend/register", async function (req, res) {
    logger.info("register");
    try {
        [emails, groupName, portUDP, password, keyPairUser, keyPairRouter] = await databaseManager.registerGroup(req.query["user"], req.query["email"]);
        emailManager.sendPasswordEmail(emails, groupName, portUDP, password, keyPairUser, keyPairRouter);
        feedbackFetch("success", res)
    } catch (error) {
        logger.error(`Error register group ${error}`)
        feedbackFetch(`Error: ${error}`, res)
    }

});
app.get("/backend/getStatusAllVMs", async function (req, res) {
    try {
        await cookieManager.checkCookie(req, res)
        proxmoxManager.getStatusAllVMs(req.query["server"]).then(status => feedbackFetch(status, res))
    } catch (error) {
        logger.error(`Error gettingStatusAllVMs ${error}`)
    }

});
app.get("/backend/getStatusVM", async function (req, res) {
    try {
        groupName = await cookieManager.checkCookie(req, res)
        if (req.query["id"] != null) {
            proxmoxManager.getStatusVM(req.query["id"]).then(status => feedbackFetch(JSON.stringify(status), res))
        } else {
            proxmoxManager.getStatusVM(groupName.split("-").pop()).then(status => feedbackFetch(JSON.stringify(status), res))
        }
    } catch (error) {
        logger.error(`Failed gettingStatusVM ${error}`)
    }
});

app.get("/backend/getStartingTimeVM", async function (req, res) {
    try {
        groupName = await cookieManager.checkCookie(req, res)
        if (req.query["id"] != null) {
            databaseManager.getStartingTimeVM(req.query["id"]).then(startingTime => feedbackFetch(startingTime, res))
        } else {
            databaseManager.getStartingTimeVM(groupName.split("-").pop()).then(startingTime => feedbackFetch(startingTime, res))
        }
    } catch (error) {
        logger.error(`Failed gettingStartingTimeVM ${error}`)
    }

});

app.get("/backend/getGroups", async function (req, res) {
    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.getGroups(res).then(groups => feedbackFetch(groups, res))
    } catch (error) {
        logger.error(`Error getting groups ${error}`)
    }

});
app.get("/backend/eliminateGroup", async function (req, res) {
    logger.info("eliminateGroup");
    try {
        groupName = await cookieManager.checkCookie(req, res);
        await databaseManager.eliminateGroup(req.query["id"]);
        proxmoxManager.eliminateMachine(groupName.split("-").pop())
        routerosManager.eliminateRouterOSConfig(groupName)
    } catch (error) {
        logger.error(`Error eliminating group ${error}`)
    }

});
app.get("/backend/getEmails", async function (req, res) {
    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.getEmails(res).then(emails => feedbackFetch(emails, res))
    } catch (error) {
        logger.error(`Error getting Emails ${error}`)
    }

});
app.get("/backend/eliminateEmail", async function (req, res) {
    logger.info("eliminateEmail");
    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.eliminateEmail(req.query["id"], res).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Error eliminating Email ${error}`)
    }

});
app.get("/backend/getSubjects", async function (req, res) {
    try {
        subjects = await databaseManager.getSubjects(res);
        feedbackFetch(subjects, res)
    } catch (error) {
        logger.error(`Failed gettingSubjects ${error}`)
    }

});
app.get("/backend/addSubject", async function (req, res) {
    logger.info("addSubject");
    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.addSubject(req.query["id"]).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Error adding subject ${error}`)
    }


});
app.get("/backend/eliminateSubject", async function (req, res) {
    logger.info("eliminateSubject");
    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.eliminateSubject(req.query["id"]).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Failed to eliminateSubject ${error}`)
    }

});
app.get("/backend/activateSubject", async function (req, res) {
    logger.info("activateSubject");

    try {
        await cookieManager.checkCookie(req, res)
        databaseManager.activateSubject(req.query["id"]).then(feedbackFetch("", res))
    } catch (error) {
        logger.error(`Failed activating machine ${error}`)
    }

});
app.get("/backend/restartDatabase", async function (req, res) {
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
app.get("/backend/resumeMachine", async function (req, res) {
    logger.info("resumeMachine");
    try {
        groupName = await cookieManager.checkCookie(req, res)
        if (req.query["id"] != null) {
            proxmoxManager.resumeMachine(req.query["id"]);
        } else {
            proxmoxManager.resumeMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed resumingMachine ${error}`)
    }
});

app.get("/backend/suspendMachine", async function (req, res) {
    logger.info("suspendMachine");
    try {
        groupName = await cookieManager.checkCookie(req, res)
        if (req.query["id"] != null) {
            proxmoxManager.suspendMachine(req.query["id"]);
        } else {
            proxmoxManager.suspendMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed suspendingMachine ${error}`)
    }
});
app.get("/backend/eliminateCookie", function (req, res) {
    logger.info("eliminateCookie");
    cookieManager.eliminateCookie(res);
});
app.get("/backend/eliminateMachine", async function (req, res) {
    logger.info("eliminateMachine");
    try {
        groupName = await cookieManager.checkCookie(req, res)

        if (req.query["id"] != null) {
            proxmoxManager.eliminateMachine(req.query["id"]);
        } else {
            proxmoxManager.eliminateMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed eliminathingMachine ${error}`)
    }
});
app.listen(port, () => logger.info(`App listening on port ${port}!`));
