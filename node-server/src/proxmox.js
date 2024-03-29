const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const proxmox = require("proxmox")(process.env.PROXMOX_USER, process.env.PROXMOX_PASSWORD, process.env.PROXMOX_IP_ADDRESS);
const PROXMOX_SERVERS = process.env.PROXMOX_SERVERS_NAMES.split(" ");
var logger = require(path.resolve(__dirname, "logger.js"));
const { sleep } = require(path.resolve(__dirname, "globalFunctions.js"));

const activateMachine = async (vmID) => {
    return new Promise((resolve, reject) => {
        var serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Activating machine ${vmID} on server ${serverID}`);
        try {
            proxmox.qemu.start(serverID, vmID, (err, data) => {
                resolve();
            });
        } catch {
            logger.error("Activate Machine failed trycatch");
            reject();
        }
    })
};
const stopMachine = (vmID) => {
    return new Promise(async (resolve, reject) => {
        var serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Stopping machine ${vmID} on server ${serverID}`);
        try {
            proxmox.qemu.stop(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to stop machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to stop machine ${vmID}: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("stopMachine failed trycatch");
            reject()
        }
    });
};
const getStatusAllVMs = (proxmoxServer) => {
    return new Promise((resolve, reject) => {
        try {
            var data = { full: 1 };
            proxmox.getQemu(PROXMOX_SERVERS[proxmoxServer], data, (err, data) => {
                if (err) {
                    logger.error(`Failed to getStatusAllVMs: ${err}`);
                } else {
                    var data_json = JSON.parse(data).data;
                    data_json.sort((a, b) => a["vmid"] - b["vmid"]);
                    resolve(JSON.stringify(data_json));
                }
            });
        } catch (error) {
            logger.error("getStatusAllVMs failed trycatch");
            reject()
        }
    })

};
const getActiveVM = (vmID) => {
    return new Promise (async (resolve, reject) => {
        var statusVM = await getStatusVM(vmID);
        resolve(statusVM.status != "stopped")
    })

}
const getStatusVM = (vmID) => {
    return new Promise(async (resolve, reject) => {
        var serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        try {
            proxmox.qemu.getStatusCurrent(serverID, vmID, (err, data) => {
                if (err) {
                    logger.info(`Failed to getStatusVM: ${err}`);
                    logger.error(`Failed to getStatusVM: ${err}`);
                } else {
                    var data_json = JSON.parse(data).data;
		 
                    resolve(data_json);
                }
            });
        } catch {
            logger.error("getStatusVM failed trycatch");
        }
    });
};
const cloneMachine = (group, groupName) => {
    return new Promise((resolve, reject) => {
        logger.info(group);
	group = parseInt(group)
        var vmID = ((group % 3) + 1) * 10000 + group - (group % 100);
        var serverID = PROXMOX_SERVERS[group % process.env.PROXMOX_SERVERS_COUNT];
        var newID = { newid: group, name: groupName, full: 1 };
        logger.info(`Cloning machine ${vmID} on server ${serverID}`);
        try {
            proxmox.qemu.clone(serverID, vmID, newID, (err, data) => {
                if (err) {
                    logger.error(`Failed to clone machine: ${err}`);
                    reject(`Failed to clone machine, contact professor: ${err}`);
                }
                if (data) {
                    logger.info(`Sucess to clone machine: ${vmID}: ${data}`);
                    resolve("Success");
                }
            });
        } catch (error){
            logger.error(`Failed to clone machine, contact professor: ${error}`);
            reject(`Failed to clone machine, contact professor: ${error}`);
        }
    });
};

const resumeMachine = (vmID) => {
    return new Promise(async (resolve, reject) => {
        var serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Resuming machine ${vmID} on server ${serverID}`);
        try {
            proxmox.qemu.resume(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to resume machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to resume machine: ${vmID}: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("resumeMachine failed trycatch");
            resolve("Failed");
        }
    });
};

const suspendMachine = (vmID) => {
    return new Promise(async (resolve, reject) => {
        var serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Suspending machine ${vmID} on server ${serverID}`);
        try {
            proxmox.qemu.suspend(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to suspend machine: ${err}`);
                    resolve("Failed");
                }
                if (data) {
                    logger.info(`Sucess to suspend machine: ${vmID}: ${data}`);
                    resolve("Success");
                }
            });
        } catch {
            logger.error("suspendMachine failed trycatch");
            resolve("Failed");
        }
    });
};

const deleteMachine = (vmID) => {
    return new Promise(async (resolve, reject) => {
        await stopMachine(vmID);
        await sleep(3000);
        var serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`deleting machine ${vmID} on server ${serverID}`);
        try {
            proxmox.qemu.del(serverID, vmID, (err, data) => {
                if (err) {
                    logger.error(`Failed to delete machine: ${err}`);
                    reject();
                }
                if (data) {
                    logger.info(`Sucess to delete machine: ${vmID}: ${data}`);
                    resolve(groupName);
                }
            });
        } catch {
            logger.error("deleteMachine failed trycatch");
            reject();
        }
    });
};
const machineFinishedClonning = (vmID) => {
    return new Promise((resolve, reject) => {
        let interval = setInterval(async () => {
            var nodeInfo = await getStatusVM(vmID);
            if (nodeInfo) {
                if (!nodeInfo["lock"]) {
                    logger.info(`Not longer locked ${vmID}`);
                    resolve();
                    clearInterval(interval)
                }
            }
        }, 5000);
    });
};
const modifyMachineVLAN = (vmID, bridge) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`modifyMachineVLAN ${vmID} ${bridge}`);
        await machineFinishedClonning(vmID);
        logger.info("Machine finished clonning");
        var serverID = PROXMOX_SERVERS[vmID % process.env.PROXMOX_SERVERS_COUNT];
        logger.info(`Modifiying machine ${vmID} VLAN to ${vmID} on server ${serverID} ${PROXMOX_SERVERS}`);
        data = { net0: `virtio,bridge=${bridge},tag=${vmID}` };
        try {
            proxmox.qemu.updateConfig(serverID, vmID, data, (err, data) => {
                if (err) {
                    logger.error(`Failed to modify VLAN machine: ${err}`);
                    reject(err)
                }
                if (data) {
                    logger.info(`Sucess to modify VLAN machine ${vmID}: ${data}`);
                    resolve("Success");
                }
            });
        } catch (err){
            logger.error("modifyMachineVLAN failed trycatch");
            reject(err);
        }
    });
};

module.exports = {
    activateMachine,
    stopMachine,
    getStatusAllVMs,
    getStatusVM,
    getActiveVM,
    cloneMachine,
    resumeMachine,
    suspendMachine,
    deleteMachine,
    modifyMachineVLAN,
};
