const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const proxmox = require("proxmox")(process.env.PROXMOX_USER, process.env.PROXMOX_PASSWORD, process.env.PROXMOX_IP_ADDRESS);
const PROXMOX_SERVERS = process.env.PROXMOX_SERVERS_NAMES.split(" ");
const { sendWarningMail } = require(path.resolve(__dirname, "emails.js"));
var logger = require(path.resolve(__dirname, "logger.js"));

const feedback_fetch = (text, res) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write(text);
    res.end();
};
const getVmId = (req, user) => {
    if (user == null) {
        return req.query["id"];
    } else {
        return user.split("-").pop();
    }
};

const activateMachine = (user, req, res) => {
    try {
        if (req.query["hours"] < 1) {
            feedback_fetch("N", res);
            return 0;
        }
        vmID = getVmId(req, user);
        serverID = PROXMOX_SERVERS[vmID % 3];
        logger.info(`Activating machine ${req.query["node"]} on server ${serverID}`);
        proxmox.qemu.start(serverID, vmID, (err, data) => {
            feedback_fetch("Y", res);
        });
    } catch {
        logger.error("Activate Machine failed trycatch");
    }

    setTimeout(function () {
        sendWarningMail(req.query["user"]);
    }, req.query["hours"] * 3600000 - 1800000);
    setTimeout(function () {
        sendWarningMail(req.query["user"]);
    }, 1800000);
};
const stopMachine = (user, req, res) => {
    try {
        vmID = getVmId(req, user);
        serverID = PROXMOX_SERVERS[vmID % 3];
        logger.info(`Stopping machine ${req.query["node"]} on server ${serverID}`);
        proxmox.qemu.stop(serverID, vmID, (err, data) => {
            if (err) {
                logger.error(`Failed to stop machine: ${err}`);
                resolve("Failed");
            }
            if (data) {
                logger.info(`Sucess to stop machine: ${data}`);
                resolve("Success");
            }
        });
    } catch {
        logger.error("stopMachine failed trycatch");
    }
};
const getNodes = (req, res) => {
    try {
        proxmox.getQemu(PROXMOX_SERVERS[req.query["server"]], (err, data) => {
            if (err) {
                logger.error(`Failed to getNodes: ${err}`);
            } else {
                data_json = JSON.parse(data).data;
                data_json.sort((a, b) => a["vmid"] - b["vmid"]);
                feedback_fetch(JSON.stringify(data_json), res);
            }
        });
    } catch (error) {
        logger.error("getNodes failed trycatch");
    }
};
const getNode = (user, req, res) => {
    try {
        vmID = getVmId(req, user);
        serverID = PROXMOX_SERVERS[vmID % 3];
        proxmox.qemu.getStatusCurrent(serverID, vmID, (err, data) => {
            if (err) {
                logger.error(`Failed to getNode: ${err}`);
            } else {
                data_json = JSON.parse(data).data;
                feedback_fetch(JSON.stringify(data_json), res);
            }
        });
    } catch {
        logger.error("getNode failed trycatch");
    }
};
const cloneMachine = (group) => {
    return new Promise((resolve, reject) => {
        try {
            logger.info(group);
            vmID = ((group % 3) + 1) * 10000 + group - (group % 100);
            serverID = PROXMOX_SERVERS[group % 3];
            logger.info(`Cloning machine ${vmID} on server ${serverID}`);
            newID = { newid: group, name: group };
            proxmox.qemu.clone(serverID, vmID, newID, (err, data) => {
                if (err) {
                    logger.error(`Failed to clone machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to clone machine: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("cloneMachine failed trycatch");
            resolve("Failed");
        }
    });
};

const resumeMachine = (user, req, res) => {
    return new Promise((resolve, reject) => {
        try {
            vmID = getVmId(req, user);
            serverID = PROXMOX_SERVERS[vmID % 3];
            logger.info(`Resuming machine ${vmID} on server ${serverID}`);
            proxmox.qemu.resume(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to resume machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to resume machine: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("resumeMachine failed trycatch");
            resolve("Failed");
        }
    });
};

const suspendMachine = (user, req, res) => {
    return new Promise((resolve, reject) => {
        try {
            vmID = getVmId(req, user);
            serverID = PROXMOX_SERVERS[vmID % 3];
            logger.info(`Suspending machine ${vmID} on server ${serverID}`);
            proxmox.qemu.suspend(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to suspend machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to suspend machine: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("suspendMachine failed trycatch");
            resolve("Failed");
        }
    });
};

const eliminateMachine = (user, req, res) => {
    return new Promise((resolve, reject) => {
        try {
            //vmID = getVmId(req, user);
            vmID = 108;
            serverID = PROXMOX_SERVERS[vmID % 3];
            logger.info(`Eliminating machine ${vmID} on server ${serverID}`);
            proxmox.qemu.del(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to eliminate machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to eliminate machine: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("eliminateMachine failed trycatch");
            resolve("Failed");
        }
    });
};

const modifyMachineVLAN = (user, vlan, req, res) => {
    return new Promise((resolve, reject) => {
        try {
            vmID = getVmId(req, user);
            vmID = 105;
            serverID = PROXMOX_SERVERS[vmID % 3];
            logger.info(`Modifiying machine ${vmID} VLAN to ${vlan} on server ${serverID} ${PROXMOX_SERVERS}`);
            data = { net0: `virtio,tag=${vlan}` };
            proxmox.qemu.updateConfig(serverID, vmID, data, (err, data) => {
                if (err) {
                    logger.error(`Failed to modify VLAN machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to modify VLAN machine: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("modifyMachineVLAN failed trycatch");
            resolve("Failed");
        }
    });
};
eliminateMachine(null, null, 1)
//modifyMachineVLAN(1, 300, 1, 1).then(console.log);
module.exports = {
    activateMachine,
    stopMachine,
    getNodes,
    getNode,
    cloneMachine,
    resumeMachine,
    suspendMachine,
    eliminateMachine,
    modifyMachineVLAN,
};
