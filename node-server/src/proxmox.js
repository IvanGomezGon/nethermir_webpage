const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const proxmox = require("proxmox")(process.env.PROXMOX_USER, process.env.PROXMOX_PASSWORD, process.env.PROXMOX_IP_ADDRESS);
const PROXMOX_SERVERS = process.env.PROXMOX_SERVERS_NAMES.split(" ");
const { sendWarningMail } = require(path.resolve(__dirname, "emails.js"));
var logger = require(path.resolve(__dirname, "logger.js"));
const { feedback_fetch } = require(path.resolve(__dirname, "globalFunctions.js"));
const {sleep} = require(path.resolve(__dirname, "globalFunctions.js"));
const getVmId = (groupName, req) => {
    return new Promise((resolve, reject) => {
        if (groupName == null) {
            resolve(req.query["id"]);
        } else {
            resolve(groupName.split("-").pop());
        }
    })
};

const activateMachine = async (groupName, req, res) => {
    if (req.query["hours"] < 1) {
        feedback_fetch("N", res);
        return 0;
    }
    vmID = await getVmId(groupName, req);
    serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
    logger.info(`Activating machine ${req.query["node"]} on server ${serverID}`);
    try {
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
const stopMachine = (groupName, req, res) => {
    return new Promise(async (resolve, reject) => {
        vmID = await getVmId(groupName, req);
        serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Stopping machine ${req.query["node"]} on server ${serverID}`);
        try {
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
    })

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
const getNode = async (groupName, req, res) => {
    return new Promise(async (resolve, reject) => {
        vmID = await getVmId(groupName, req);
        serverID = PROXMOX_SERVERS[0];
        try {
            proxmox.qemu.getStatusCurrent(serverID, vmID, (err, data) => {
                if (err) {
                    logger.info(`Failed to getNode: ${err}`)
                    logger.error(`Failed to getNode: ${err}`);
                } else {
                    data_json = JSON.parse(data).data;
                    feedback_fetch(JSON.stringify(data_json), res);
                    resolve(data_json)
                }
            });
        } catch {
            logger.error("getNode failed trycatch");
        }
    })

};
const cloneMachine = (group) => {
    return new Promise((resolve, reject) => {
        logger.info(group);
        vmID = ((group % 3) + 1) * 10000 + group - (group % 100);
        serverID = PROXMOX_SERVERS[group % process.env.PROXMOX_SERVERS_COUNT];
        newID = { newid: group, name: group, full: 1 };
        logger.info(`Cloning machine ${vmID} on server ${serverID}`);
        try {
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

const resumeMachine = (groupName, req, res) => {
    return new Promise(async (resolve, reject) => {
        vmID = await getVmId(groupName, req);
        serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Resuming machine ${vmID} on server ${serverID}`);
        try {
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

const suspendMachine = (groupName, req, res) => {
    return new Promise(async (resolve, reject) => {
        vmID = await getVmId(groupName, req);
        serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Suspending machine ${vmID} on server ${serverID}`);
        try {
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

const eliminateMachine = (groupName, req, res) => {
    return new Promise(async (resolve, reject) => {
        await stopMachine(groupName, req, res);
        await sleep(3000);
        vmID = await getVmId(groupName, req);
        serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Eliminating machine ${vmID} on server ${serverID}`);
        try {
            proxmox.qemu.del(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to eliminate machine: ${err}`);
                    reject();
                }
                if (data) {
                    logger.info(`Sucess to eliminate machine: ${data}`);
                    resolve(groupName);
                }
            });
        } catch {
            logger.error("eliminateMachine failed trycatch");
            reject();
        }
    });
};
const machineFinishedClonning = (groupName, req, res) => {
    return new Promise((resolve, reject) => {
        setInterval(async () => {
            logger.info("Before getNode")
            nodeInfo = await getNode(groupName, req, res);
            logger.info("After getNode")
            if(nodeInfo){
                if (!nodeInfo["lock"]){
                    logger.info("No longer locked")
                    resolve()
                }
            }

        }, 2000);
    })
}
const modifyMachineVLAN = (groupName, vlan, bridge, req, res) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`modifyMachineVLAN ${groupName} ${vlan} ${bridge}`)
        await machineFinishedClonning(groupName, req, res);
        logger.info("Machine finished clonning")
        vmID = await getVmId(groupName, req);
        serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Modifiying machine ${vmID} VLAN to ${vlan} on server ${serverID} ${PROXMOX_SERVERS}`);
        data = { net0: `virtio,bridge=${bridge},tag=${vlan}`};
        logger.info(`DATA MODIFY VLAN: ${data}`)
        try {
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
