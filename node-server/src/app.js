const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const express = require('express');
const cors=require('cors');
const cookieParser = require('cookie-parser')

const corsOptions ={
   origin:'http://nethermir.uab.cat', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
   allowCredentials: true,
   exposedHeaders: ["set-cookie"],
}
const feedback_fetch = (text, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    res.write(text); 
    res.end();
} 
const {activateMachine, stopMachine, getNodes, getNode, resumeMachine, suspendMachine, eliminateMachine} = require(path.resolve(__dirname, 'proxmox.js'))
const {getGroups, getEmails, eliminateGroup, eliminateEmail, getSubjects, eliminateSubject, authenticate, registerGroup, restartDatabase, addSubject, activateSubject} = require (path.resolve(__dirname, 'database.js'))
const {setCookie, checkCookie, eliminateCookie} = require(path.resolve(__dirname, 'cookies.js'))

const app = express()
const port = process.env.LISTENING_PORT
app.use(cors(corsOptions)) 
app.use(cookieParser())

// ALL BACKEND CALLS FROM FRONTEND

app.get('/backend/checkCookie', function(req, res){
    console.log("checkCookie")
    checkCookie(req,res)
        .then((user) => feedback_fetch(user, res))
        .catch(() => console.log("checkCookie failed"))
})
app.get('/backend/activateMachine', function(req, res){
    console.log("activateMachine")
    checkCookie(req,res)
        .then((user)=>{if (req.query['id']!=null){activateMachine(null, req,res)}else{activateMachine(user, req, res)}})
        .catch(()=>{console.log("Failed to authenticate")})
})
app.get('/backend/stopMachine', function(req, res){
    console.log("stopMachine")
    checkCookie(req,res)
        .then((user)=>{if (req.query['id'] != null){stopMachine(null, req,res)}else{stopMachine(user, req, res)}})
        .catch(()=>{console.log("Failed to stop machine")})
})
app.get('/backend/login', function(req, res){
    console.log("login")
    authenticate(req,res)
        .then((x)=> {setCookie(x, res);})
        .catch(() => {console.log("Failed to login")})  
})
app.get('/backend/register', function(req, res){
    console.log("register")
    registerGroup(req, res)
})
app.get('/backend/getNodes', function(req, res){
    checkCookie(req,res)
        .then(()=> {getNodes(req, res)})
        .catch(() => {console.log("Failed to getNodes")})
})
app.get('/backend/getNode', function(req, res){
    checkCookie(req,res)
    .then((user)=> {if (req.query['id']!=null){getNode(null, req, res)}else{getNode(user, req, res)}})
    .catch(() => {console.log("Failed to getNode")})
})
app.get('/backend/getGroups', function(req, res){
    checkCookie(req,res)
        .then(()=> {getGroups(res)})
        .catch(() => {console.log("Failed to getGroups")})
})
app.get('/backend/eliminateGroup', function(req, res){
    console.log("eliminateGroup")
    checkCookie(req,res)
//      .then((user) => {eliminateMachine(user, req, res)})
        .then(()=> {eliminateGroup(req, res)})
        .catch(() => {console.log("Failed to eliminateGroup")})
})
app.get('/backend/getEmails', function(req, res){
    console.log("getEmails")
    checkCookie(req,res)
        .then(()=> {getEmails(res)})
        .catch(() => {console.log("Failed to getEmails")})
})
app.get('/backend/eliminateEmail', function(req, res){
    console.log("eliminateEmail")
    checkCookie(req,res)
        .then(()=> {eliminateEmail(req, res)})
        .catch(() => {console.log("Failed to eliminateEmail")})
})
app.get('/backend/getSubjects', function(req, res){
    getSubjects(res)
        
})
app.get('/backend/addSubject', function(req, res){
    console.log("addSubject")
    checkCookie(req,res)
        .then(()=> {addSubject(req, res)})
        .catch(() =>{console.log("Failed to addSubject")})
})
app.get('/backend/eliminateSubject', function(req, res){
    console.log("eliminateSubject")
    checkCookie(req,res)
        .then(()=> {eliminateSubject(req, res)})
        .catch(() =>{console.log("Failed to eliminateSubject")})
})
app.get('/backend/activateSubject', function(req, res){
    console.log("activateSubject")
    checkCookie(req,res)
        .then(()=> {activateSubject(req, res)})
        .catch(() =>{console.log("Failed to activateSubject")})
})
app.get('/backend/restartDatabase', function(req, res){
    console.log("restartDatabase")
    checkCookie(req,res)
        .then((user)=> {if (user == 'root'){restartDatabase().then(feedback_fetch("Y", res))}})
        .catch(() =>{console.log("Failed to restartDatabase")})
})
app.get('/backend/resumeMachine', function(req, res){
    console.log("resumeMachine")
    checkCookie(req,res)
        .then((user)=> {if (req.query['id'] != null){resumeMachine(null, req,res)}else{resumeMachine(user, req, res)}})
        .catch(() =>{console.log("Failed to resumeMachine")})
})

app.get('/backend/suspendMachine', function(req, res){
    console.log("suspendMachine")
    checkCookie(req,res)
        .then((user)=> {if (req.query['id'] != null){suspendMachine(null, req,res)}else{suspendMachine(user, req, res)}})
        .catch(() =>{console.log("Failed to resumeMachine")})
})
app.get('/backend/eliminateCookie', function(req, res){
    console.log("EliminateCookie")
    eliminateCookie(req,res)
})
app.get('/backend/eliminateMachine', function(req,res){
    console.log("EliminateMachine")
    checkCookie(req,res)
    .then((user)=> {if (req.query['id'] != null){eliminateMachine(null, req,res)}else{eliminateMachine(user, req, res)}})
    .catch(() =>{console.log("Failed to EliminateMachine")})
})
app.listen(port, () => console.log(`App listening on port ${port}!`))

