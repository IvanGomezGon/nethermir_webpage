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

const { getActiveVM, activateMachine, stopMachine, getStatusAllVMs, getStatusVM, resumeMachine, suspendMachine, eliminateMachine } = require(path.resolve(__dirname, "proxmox.js"));
const { getStartingTimeVM, getRenovationHoursVM, changeRenovationHoursVM, getEmailsFromGroupName, getGroups, getEmails, eliminateGroup, eliminateEmail, getSubjects, eliminateSubject, authenticate, registerGroup, restartDatabase, addSubject, activateSubject, generateMachine } = require(path.resolve(__dirname, "database.js"));
const { setCookie, checkCookie, eliminateCookie } = require(path.resolve(__dirname, "cookies.js"));
const { eliminateRouterOSConfig } = require(path.resolve(__dirname, "routeros.js"));
const { feedback_fetch } = require(path.resolve(__dirname, "globalFunctions.js"));
var logger = require(path.resolve(__dirname, "logger.js"));

const app = express();
const port = process.env.SERVER_LISTEN_PORT;
app.use(cors(corsOptions));
app.use(cookieParser());

// ALL BACKEND CALLS FROM FRONTEND

app.get("/backend/checkCookie", function (req, res) {
    logger.info("checkCookie");
    checkCookie(req, res)
        .then((groupName) => feedback_fetch(groupName, res))
        .catch(() => logger.info("checkCookie failed"));
});
app.get("/backend/activateMachine", async function (req, res) {
    try {
        logger.info("activateMachine started");
        groupName = await checkCookie(req, res)
        group = req.query["id"] != null ? group = req.query["id"] : group = groupName.split("-").pop()
        active = await getActiveVM(group);
        logger.info(`active: ${active}`)
        await changeRenovationHoursVM(group, active, req.query["hours"]);
        renovationHours = await getRenovationHoursVM(group)
        logger.info(`active: ${renovationHours}`)
        await activateMachine(group);
        emails = await getEmailsFromGroupName(group, req.query["id"]);
        setTimeout(async function () {
            if (await getRenovationHoursVM(group) == renovationHours) {
                sendWarningMail(emails);
                setTimeout(async function () {
                    if (await getRenovationHoursVM(group) == renovationHours) {
                        stopMachine(group, req, res)
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
        groupName = await checkCookie(req, res)
        generateMachine(groupName).then(feedback => feedback_fetch(feedback, res))
    } catch (error) {
        logger.error(`Failed generatingMachine ${error}`)
    }
});

app.get("/backend/stopMachine", async function (req, res) {
    logger.info("stopMachine");
    try {
        groupName = await checkCookie(req, res)

        if (req.query["id"] != null) {
            stopMachine(req.query["id"], req, res);
        } else {
            stopMachine(groupName.split("-").pop(), req, res);
        }
    } catch (error) {
        logger.error(`Failed stopingMachine ${error}`)
    }

});
app.get("/backend/login", function (req, res) {
    logger.info("login");
    authenticate(req, res)
        .then((x) => {
            setCookie(x, res);
        })
        .catch((x) => {
            logger.info(`Failed to login ${x}`);
        });
});
app.get("/backend/register", function (req, res) {
    logger.info("register");
    registerGroup(req).then(feedback => feedback_fetch(feedback, res));
});
app.get("/backend/getStatusAllVMs", function (req, res) {
    checkCookie(req, res)
        .then(() => {
            getStatusAllVMs(req.query["server"]).then(status => feedback_fetch(status, res))
        })
        .catch(() => {
            logger.info("Failed to getStatusAllVMs");
        });
});
app.get("/backend/getStatusVM", async function (req, res) {
    try {
        groupName = await checkCookie(req, res)
        if (req.query["id"] != null) {
            getStatusVM(req.query["id"]).then(status => feedback_fetch(JSON.stringify(status), res))
        } else {
            getStatusVM(groupName.split("-").pop()).then(status => feedback_fetch(JSON.stringify(status), res))
        }
    } catch (error) {
        logger.error(`Failed gettingStatusVM ${error}`)
    }
});

app.get("/backend/getStartingTimeVM", async function (req, res) {
    try {
        groupName = await checkCookie(req, res)
        if (req.query["id"] != null) {
            getStartingTimeVM(req.query["id"]).then(startingTime => feedback_fetch(startingTime, res))
        } else {
            getStartingTimeVM(groupName.split("-").pop()).then(startingTime => feedback_fetch(startingTime, res))
        }
    } catch (error) {
        logger.error(`Failed gettingStartingTimeVM ${error}`)
    }

});

app.get("/backend/getGroups", function (req, res) {
    checkCookie(req, res)
        .then(() => {
            getGroups(res).then(groups => feedback_fetch(groups, res))
        })
        .catch(() => {
            logger.info("Failed to getGroups");
        });
});
app.get("/backend/eliminateGroup", function (req, res) {
    logger.info("eliminateGroup");
    checkCookie(req, res)
        .then(async () => {
            return await eliminateGroup(req.query["id"]);
        })
        .then((groupName) => {
            eliminateMachine(vmID)
            logger.info(`BEFORE ELIMINATE : ${groupName}`)
            eliminateRouterOSConfig(groupName)
        })
        .catch(() => {
            logger.info("Failed to eliminateGroup");
        });
});
app.get("/backend/getEmails", function (req, res) {
    checkCookie(req, res)
        .then(() => {
            getEmails(res).then(emails => feedback_fetch(emails, res))
        })
        .catch(() => {
            logger.info("Failed to getGroups");
        });
});
app.get("/backend/eliminateEmail", function (req, res) {
    logger.info("eliminateEmail");
    checkCookie(req, res)
        .then(() => {
            eliminateEmail(req.query["id"], res).then(feedback_fetch("", res))
        })
        .catch(() => {
            logger.info("Failed to eliminateEmail");
        });
});
app.get("/backend/getSubjects", async function (req, res) {
    try {
        subjects = await getSubjects(res);
        feedback_fetch(subjects, res)
    } catch (error) {
        logger.error(`Failed gettingSubjects ${error}`)
    }

});
app.get("/backend/addSubject", function (req, res) {
    logger.info("addSubject");
    checkCookie(req, res)
        .then(() => {
            addSubject(req.query["id"]).then(feedback_fetch("", res))
        })
        .catch(() => {
            logger.info("Failed to addSubject");
        });
});
app.get("/backend/eliminateSubject", function (req, res) {
    logger.info("eliminateSubject");
    checkCookie(req, res)
        .then(() => {
            eliminateSubject(req.query["id"]).then(feedback_fetch("", res))
        })
        .catch(() => {
            logger.info("Failed to eliminateSubject");
        });
});
app.get("/backend/activateSubject", function (req, res) {
    logger.info("activateSubject");
    checkCookie(req, res)
        .then(() => {
            activateSubject(req.query["id"]).then(feedback_fetch("", res))
        })
        .catch(() => {
            logger.info("Failed to activateSubject");
        });
});
app.get("/backend/restartDatabase", async function (req, res) {
    logger.info("restartDatabase");
    try {
        groupName = await checkCookie(req, res)
        if (groupName == "root") {
            restartDatabase().then(feedback_fetch("", res));
        }
    } catch (error) {
        logger.error(`Failed restartingDatabase ${error}`)
    }
});
app.get("/backend/resumeMachine", async function (req, res) {
    logger.info("resumeMachine");
    try {
        groupName = await checkCookie(req, res)
        if (req.query["id"] != null) {
            resumeMachine(req.query["id"]);
        } else {
            resumeMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed resumingMachine ${error}`)
    }
});

app.get("/backend/suspendMachine", async function (req, res) {
    logger.info("suspendMachine");
    try {
        groupName = await checkCookie(req, res)
        if (req.query["id"] != null) {
            suspendMachine(req.query["id"]);
        } else {
            suspendMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed suspendingMachine ${error}`)
    }
});
app.get("/backend/eliminateCookie", function (req, res) {
    logger.info("EliminateCookie");
    eliminateCookie(req, res);
});
app.get("/backend/eliminateMachine", async function (req, res) {
    logger.info("EliminateMachine");
    try {
        groupName = await checkCookie(req, res)

        if (req.query["id"] != null) {
            eliminateMachine(req.query["id"]);
        } else {
            eliminateMachine(groupName.split("-").pop());
        }
    } catch (error) {
        logger.error(`Failed eliminathingMachine ${error}`)
    }
});
app.listen(port, () => logger.info(`App listening on port ${port}!`));
