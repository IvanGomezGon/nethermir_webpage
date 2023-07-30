const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const proxmox = require('proxmox')(process.env.PROXMOX_USER, process.env.PROXMOX_PASSWORD, process.env.PROXMOX_IP_ADDRESS)
const PROXMOX_SERVERS=process.env.PROXMOX_SERVERS_NAMES.split(' ');
const  {sendWarningMail} = require(path.resolve(__dirname, 'emails.js'))
var {logger} = require(path.resolve(__dirname, 'logger.js'))


const feedback_fetch = (text, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    res.write(text); 
    res.end();
} 

const activateMachine = (user, req, res) =>{
    try{
        if (req.query['hours']<1) {feedback_fetch("N", res); return 0;}
        if (user == null){vmID = req.query['id']}
        else {vmID = user.split("-").pop()}   
        serverID = PROXMOX_SERVERS[vmID % 3]
        logger.info(`Activating machine ${req.query['node']} on server ${serverID}`)
        proxmox.qemu.start(serverID, vmID, (err, data)=>{feedback_fetch("Y", res)})
        setTimeout(function(){sendWarningMail(req.query['user'])}, req.query['hours']*3600000-1800000)
        setTimeout(function(){sendWarningMail(req.query['user'])}, 1800000)
    }catch{}

}
const stopMachine = (user, req, res) =>{
    try{
        if (user == null){vmID = req.query['id']}
        else {vmID = user.split("-").pop()}     
        serverID = PROXMOX_SERVERS[vmID % 3]
        logger.info(`Stopping machine ${req.query['node']} on server ${serverID}`)
        proxmox.qemu.stop(serverID, vmID, (err, data)=>{feedback_fetch("Y", res)})   
    }catch{}
     
}
const getNodes = (req, res) => {
    try{
        proxmox.getQemu(PROXMOX_SERVERS[req.query['server']],(err, data) =>{
            if (err) {logger.info("mal")}
            else{
                data_json = JSON.parse(data).data
                data_json.sort((a,b) => a['vmid'] - b['vmid'])
                feedback_fetch(JSON.stringify(data_json), res)
            }
        })
    }catch (error){console.error("WEEK WEEEK", error)}
}
const getNode = (user, req, res) => {
    try{
        if (user == null){vmID = req.query['id']}
        else {vmID = user.split("-").pop()}   
        serverID = PROXMOX_SERVERS[vmID % 3]
        proxmox.qemu.getStatusCurrent(serverID,vmID,(err, data) =>{
            if (err) {logger.info("mal")}
            else{
                data_json = JSON.parse(data).data
                feedback_fetch(JSON.stringify(data_json), res)
            }
        }) 
    }catch{}
}
const cloneMachine = (group) =>{
    return new Promise ((resolve, reject) => {
        logger.info(group)
        vmID = (group % 3 + 1) * 10000 + group - group % 100;
        serverID = PROXMOX_SERVERS[group % 3]
        logger.info('Cloning machine', vmID, 'on server ', serverID)
        newID = {newid:group, name:group}
        proxmox.qemu.clone(serverID, vmID, newID, (err, data)=>{
            if (err){logger.info(err); resolve('Failed')}
            if (data){logger.info(data);resolve('Success')}
        }) 
    })
}

const resumeMachine = (user, req, res) => {
    if (user == null){vmID = req.query['id']}
    else {vmID = user.split("-").pop()}   
    serverID = PROXMOX_SERVERS[vmID % 3]
    logger.info(`Resuming machine ${vmID} on server ${serverID}`)
    proxmox.qemu.resume(serverID, vmID, (err, data)=>{feedback_fetch("Y", res)})  
}

const suspendMachine = (user, req, res) => {
    if (user == null){vmID = req.query['id']}
    else {vmID = user.split("-").pop()}   
    serverID = PROXMOX_SERVERS[vmID % 3]
    logger.info(`Suspending machine ${vmID} on server ${serverID}`)
    proxmox.qemu.suspend(serverID, vmID, (err, data)=>{logger.info(err, data)})  
}

const eliminateMachine = (user, req, res) => {
    if (user == null){vmID = req.query['id']}
    else {vmID = user.split("-").pop()} 
    serverID = PROXMOX_SERVERS[vmID % 3] 
    logger.info(`Eliminating machine ${vmID} on server ${serverID}`)
    proxmox.del(serverID, vmID, (err, data) => {logger.info(err, data)})

}

module.exports = {
    activateMachine,
    stopMachine,
    getNodes,
    getNode,
    cloneMachine, 
    resumeMachine, 
    suspendMachine,
    eliminateMachine,
 }