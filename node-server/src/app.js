const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
    origin: "https://nethermir.uab.cat",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    allowCredentials: true,
    exposedHeaders: ["set-cookie"],
};

const { activateMachine, stopMachine, getNodes, getNode, resumeMachine, suspendMachine, eliminateMachine } = require(path.resolve(__dirname, "proxmox.js"));
const { getGroups, getEmails, eliminateGroup, eliminateEmail, getSubjects, eliminateSubject, authenticate, registerGroup, restartDatabase, addSubject, activateSubject } = require(path.resolve(__dirname, "database.js"));
const { setCookie, checkCookie, eliminateCookie } = require(path.resolve(__dirname, "cookies.js"));
const { eliminateRouterOSConfig } = require(path.resolve(__dirname, "routeros.js"));
const {feedback_fetch} = require(path.resolve(__dirname, "globalFunctions.js"));
var logger = require(path.resolve(__dirname, "logger.js"));

const app = express();
const port = process.env.SERVER_LISTEN_PORT;
app.use(cors(corsOptions));
app.use(cookieParser());

// ALL BACKEND CALLS FROM FRONTEND

app.get("/backend/checkCookie", function (req, res) {
    logger.info("checkCookie");
    checkCookie(req, res)
        .then((user) => feedback_fetch(user, res))
        .catch(() => logger.info("checkCookie failed"));
});
app.get("/backend/activateMachine", function (req, res) {
    logger.info("activateMachine");
    checkCookie(req, res)
        .then((user) => {
            if (req.query["id"] != null) {
                activateMachine(null, req, res);
            } else {
                activateMachine(user, req, res);
            }
        })
        .catch(() => {
            logger.info("Failed to authenticate");
        });
});
app.get("/backend/stopMachine", function (req, res) {
    logger.info("stopMachine");
    checkCookie(req, res)
        .then((user) => {
            if (req.query["id"] != null) {
                stopMachine(null, req, res);
            } else {
                stopMachine(user, req, res);
            }
        })
        .catch(() => {
            logger.info("Failed to stop machine");
        });
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
    registerGroup(req, res);
});
app.get("/backend/getNodes", function (req, res) {
    checkCookie(req, res)
        .then(() => {
            getNodes(req, res);
        })
        .catch(() => {
            logger.info("Failed to getNodes");
        });
});
app.get("/backend/getNode", function (req, res) {
    checkCookie(req, res)
        .then((user) => {
            if (req.query["id"] != null) {
                getNode(null, req, res);
            } else {
                getNode(user, req, res);
            }
        })
        .catch(() => {
            logger.info("Failed to getNode");
        });
});
app.get("/backend/getGroups", function (req, res) {
    checkCookie(req, res)
        .then(() => {
            getGroups(res);
        })
        .catch(() => {
            logger.info("Failed to getGroups");
        });
});
app.get("/backend/eliminateGroup", function (req, res) {
    logger.info("eliminateGroup");
    checkCookie(req, res)
        .then(() => {
            eliminateGroup(req, res);
        })
        .then((groupName) => {
            eliminateMachine(groupName, req, res)
        })
        .then((groupName) => {
            logger.info("eliminating routerOsConfigs")
            eliminateRouterOSConfig(groupName)
        })
        .catch(() => {
            logger.info("Failed to eliminateGroup");
        });
});
app.get("/backend/getEmails", function (req, res) {
    checkCookie(req, res)
        .then(() => {
            getEmails(res);
        })
        .catch(() => {
            logger.info("Failed to getEmails");
        });
});
app.get("/backend/eliminateEmail", function (req, res) {
    logger.info("eliminateEmail");
    checkCookie(req, res)
        .then(() => {
            eliminateEmail(req, res);
        })
        .catch(() => {
            logger.info("Failed to eliminateEmail");
        });
});
app.get("/backend/getSubjects", function (req, res) {
    getSubjects(res);
});
app.get("/backend/addSubject", function (req, res) {
    logger.info("addSubject");
    checkCookie(req, res)
        .then(() => {
            addSubject(req, res);
        })
        .catch(() => {
            logger.info("Failed to addSubject");
        });
});
app.get("/backend/eliminateSubject", function (req, res) {
    logger.info("eliminateSubject");
    checkCookie(req, res)
        .then(() => {
            eliminateSubject(req, res);
        })
        .catch(() => {
            logger.info("Failed to eliminateSubject");
        });
});
app.get("/backend/activateSubject", function (req, res) {
    logger.info("activateSubject");
    checkCookie(req, res)
        .then(() => {
            activateSubject(req, res);
        })
        .catch(() => {
            logger.info("Failed to activateSubject");
        });
});
app.get("/backend/restartDatabase", function (req, res) {
    logger.info("restartDatabase");
    checkCookie(req, res)
        .then((user) => {
            if (user == "root") {
                restartDatabase().then(feedback_fetch("Y", res));
            }
        })
        .catch(() => {
            logger.info("Failed to restartDatabase");
        });
});
app.get("/backend/resumeMachine", function (req, res) {
    logger.info("resumeMachine");
    checkCookie(req, res)
        .then((user) => {
            if (req.query["id"] != null) {
                resumeMachine(null, req, res);
            } else {
                resumeMachine(user, req, res);
            }
        })
        .catch(() => {
            logger.info("Failed to resumeMachine");
        });
});

app.get("/backend/suspendMachine", function (req, res) {
    logger.info("suspendMachine");
    checkCookie(req, res)
        .then((user) => {
            if (req.query["id"] != null) {
                suspendMachine(null, req, res);
            } else {
                suspendMachine(user, req, res);
            }
        })
        .catch(() => {
            logger.info("Failed to resumeMachine");
        });
});
app.get("/backend/eliminateCookie", function (req, res) {
    logger.info("EliminateCookie");
    eliminateCookie(req, res);
});
app.get("/backend/eliminateMachine", function (req, res) {
    logger.info("EliminateMachine");
    checkCookie(req, res)
        .then((user) => {
            if (req.query["id"] != null) {
                eliminateMachine(null, req, res);
            } else {
                eliminateMachine(user, req, res);
            }
        })
        .catch(() => {
            logger.info("Failed to EliminateMachine");
        });
});
app.listen(port, () => logger.info(`App listening on port ${port}!`));
