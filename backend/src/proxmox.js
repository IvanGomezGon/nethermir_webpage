const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const proxmox = require('proxmox')(process.env.PROXMOX_USER, process.env.PROXMOX_PASS, process.env.PROXMOX_DOM)
const PROXMOX_SERVERS=process.env.PROXMOX_SERVERS.split(' ');
const  {sendWarningMail} = require(path.resolve(__dirname, 'emails.js'))
const feedback_fetch = (text, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    res.write(text); 
    res.end();
} 

const activateMachine = (req, res) =>{
    if (req.query['hours']<1) {feedback_fetch("N", res); return 0;}
    vmID = req.query['user'].slice(-3);
    console.log(`Activating machine ${vmID}`)
    proxmox.qemu.start(PROXMOX_SERVERS[0], vmID, (err, data)=>{feedback_fetch("Y", res)})
    setTimeout(function(){sendWarningMail(req.query['user'])}, req.query['hours']*3600000-1800000)
    setTimeout(function(){sendWarningMail(req.query['user'])}, 1800000)
}
const stopMachine = (req, res) =>{
    vmID = req.query['user'].slice(-3);
    console.log(`Activating machine ${req.query['node']}`)
    proxmox.qemu.stop(PROXMOX_SERVERS[0], vmID, (err, data)=>{feedback_fetch("Y", res)})    
}
const getNodes = (res) => {
    proxmox.getQemu(PROXMOX_SERVERS[0],(err, data) =>{
        if (err) {console.log("mal")}
        else{
            data_json = JSON.parse(data).data
            data_json.sort((a,b) => a['vmid'] - b['vmid'])
            console.log(data_json)
            feedback_fetch(JSON.stringify(data_json), res)
        }
    })
}
const getNode = (req, res) => {
    vmID = req.query['user'].slice(-3);
    proxmox.qemu.getStatusCurrent(PROXMOX_SERVERS[0],vmID,(err, data) =>{
        if (err) {console.log("mal")}
        else{
            data_json = JSON.parse(data).data
            console.log(data_json)
            feedback_fetch(JSON.stringify(data_json), res)
        }
    })
}
const cloneMachine = (group) =>{
    return new Promise ((resolve, reject) => {
        vmID = group.slice(-3);
        console.log(`Cloning machine`)
        newID = {newid:vmID, name:group}
        proxmox.qemu.clone(PROXMOX_SERVERS[0], process.env.PROXMOX_TEMPLATE,newID, (err, data)=>{
            if (err){resolve("Failed")}
            if (data){resolve("Success")}
        }) 
    })
}

const resumeMachine = (req, res) => {
    vmID = req.query['user'].slice(-3);
    console.log(`Resuming machine ${req.query['node']}`)
    proxmox.qemu.resume(PROXMOX_SERVERS[0], vmID, (err, data)=>{feedback_fetch("Y", res)})  
}

const suspendMachine = (req, res) => {
    vmID = req.query['user'].slice(-3);
    console.log(`Resuming machine ${req.query['node']}`)
    proxmox.qemu.suspend(PROXMOX_SERVERS[0], vmID, (err, data)=>{console.log(err, data)})  
}
module.exports = {
    activateMachine,
    stopMachine,
    getNodes,
    getNode,
    cloneMachine, 
    resumeMachine, 
    suspendMachine,
 }