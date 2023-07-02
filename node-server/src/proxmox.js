const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
proxmox = require('proxmox')(process.env.PROXMOX_USER, process.env.PROXMOX_PASS, process.env.PROXMOX_DOM)
const PROXMOX_SERVERS=process.env.PROXMOX_SERVERS.split(' ');
const  {sendWarningMail} = require(path.resolve(__dirname, 'emails.js'))
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
        proxmox.qemu.start(PROXMOX_SERVERS[0], vmID, (err, data)=>{feedback_fetch("Y", res)})
        setTimeout(function(){sendWarningMail(req.query['user'])}, req.query['hours']*3600000-1800000)
        setTimeout(function(){sendWarningMail(req.query['user'])}, 1800000)
    }catch{}

}
const stopMachine = (user, req, res) =>{
    try{
        if (user == null){vmID = req.query['id']}
        else {vmID = user.split("-").pop()}     
        console.log(`Activating machine ${req.query['node']}`)
        proxmox.qemu.stop(PROXMOX_SERVERS[0], vmID, (err, data)=>{feedback_fetch("Y", res)})   
    }catch{}
     
}
const getNodes = (req, res) => {
    try{
        proxmox = require('proxmox')(process.env.PROXMOX_USER, process.env.PROXMOX_PASS, process.env.PROXMOX_DOM.split(" ")[req.query['server']])

        proxmox.getQemu(PROXMOX_SERVERS[0],(err, data) =>{
            if (err) {console.log("mal")}
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
        proxmox.qemu.getStatusCurrent(PROXMOX_SERVERS[0],vmID,(err, data) =>{
            if (err) {console.log("mal")}
            else{
                data_json = JSON.parse(data).data
                feedback_fetch(JSON.stringify(data_json), res)
            }
        }) 
    }catch{}
}
const cloneMachine = (group) =>{
    return new Promise ((resolve, reject) => {
        console.log(group)
        vmID = (group % 3 + 1) * 10000 + group - group % 100;
        serverID = PROXMOX_SERVERS[group % 3]
        
        console.log('Cloning machine', vmID, 'on server ', serverID)
        //Eliminate this line in future, only for testing
        if (serverID != 'pve' && PROXMOX_SERVERS[0] == 'pve'){console.log("Maybe not"); resolve('Failed')}
        newID = {newid:group, name:group}
        proxmox.qemu.clone(serverID, vmID, newID, (err, data)=>{
            if (err){console.log(err); resolve('Failed')}
            if (data){console.log(data);resolve('Success')}
        }) 
    })
}

const resumeMachine = (user, req, res) => {
    if (user == null){vmID = req.query['id']}
    else {vmID = user.split("-").pop()}   
    console.log(`Resuming machine ${vmID}`)
    proxmox.qemu.resume(PROXMOX_SERVERS[0], vmID, (err, data)=>{feedback_fetch("Y", res)})  
}

const suspendMachine = (user, req, res) => {
    if (user == null){vmID = req.query['id']}
    else {vmID = user.split("-").pop()}   
    console.log(`Suspending machine ${vmID}`)
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