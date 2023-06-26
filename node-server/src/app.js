const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const express = require('express');
const cors=require('cors');
const cookieParser = require('cookie-parser')

const corsOptions ={
   origin:'http://localhost:8080', 
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
const {activateMachine, stopMachine, getNodes, getNode, resumeMachine, suspendMachine} = require(path.resolve(__dirname, 'proxmox.js'))
const {getGroups, getEmails, eliminateGroup, eliminateEmail, getSubjects, eliminateSubject, authenticate, registerGroup, restartDatabase, addSubject, activateSubject} = require (path.resolve(__dirname, 'database.js'))
const {setCookie, checkCookie} = require(path.resolve(__dirname, 'cookies.js'))

const app = express()
const port = process.env.LISTENING_PORT
app.use(cors(corsOptions)) 
app.use(cookieParser())

app.get('/activateMachine', function(req, res){
    console.log("activateMachine")
    checkCookie(req,res)
        .then((user)=>{if (req.query['id']!=null){activateMachine(null, req,res)}else{activateMachine(user, req, res)}})
        .catch(()=>{console.log("Failed to authenticate")})
})
app.get('/stopMachine', function(req, res){
    console.log("stopMachine")
    checkCookie(req,res)
        .then((user)=>{if (req.query['id'] != null){stopMachine(null, req,res)}else{stopMachine(user, req, res)}})
        .catch(()=>{console.log("Failed to stop machine")})
})
app.get('/login', function(req, res){
    console.log("login")
    authenticate(req,res)
        .then((x)=> {setCookie(x, res);})
        .catch(() => {console.log("Failed to login")})  
})
app.get('/register', function(req, res){
    console.log("register")
    registerGroup(req, res)
})
app.get('/getNodes', function(req, res){
    checkCookie(req,res)
        .then(()=> {getNodes(res)})
        .catch(() => {console.log("Failed to getNodes")})
})
app.get('/getNode', function(req, res){
    checkCookie(req,res)
    .then((user)=> {if (req.query['id']!=null){getNode(null, req, res)}else{getNode(user, req, res)}})
    .catch(() => {console.log("Failed to getNode")})
})
app.get('/getGroups', function(req, res){
    console.log("getGroups")
    checkCookie(req,res)
        .then(()=> {getGroups(res)})
        .catch(() => {console.log("Failed to getGroups")})
})
app.get('/eliminateGroup', function(req, res){
    console.log("eliminateGroup")
    checkCookie(req,res)
        .then(()=> {eliminateGroup(req, res)})
        .catch(() => {console.log("Failed to eliminateGroup")})
})
app.get('/getEmails', function(req, res){
    console.log("getEmails")
    checkCookie(req,res)
        .then(()=> {getEmails(res)})
        .catch(() => {console.log("Failed to getEmails")})
})
app.get('/eliminateEmail', function(req, res){
    console.log("eliminateEmail")
    checkCookie(req,res)
        .then(()=> {eliminateEmail(req, res)})
        .catch(() => {console.log("Failed to eliminateEmail")})
})
app.get('/getSubjects', function(req, res){
    console.log("getSubjects")
    getSubjects(res)
        
})
app.get('/addSubject', function(req, res){
    console.log("addSubject")
    checkCookie(req,res)
        .then(()=> {addSubject(req, res)})
        .catch(() =>{console.log("Failed to addSubject")})
})
app.get('/eliminateSubject', function(req, res){
    console.log("eliminateSubject")
    checkCookie(req,res)
        .then(()=> {eliminateSubject(req, res)})
        .catch(() =>{console.log("Failed to eliminateSubject")})
})
app.get('/activateSubject', function(req, res){
    console.log("activateSubject")
    checkCookie(req,res)
        .then(()=> {activateSubject(req, res)})
        .catch(() =>{console.log("Failed to activateSubject")})
})
app.get('/restartDatabase', function(req, res){
    console.log("restartDatabase")
    checkCookie(req,res)
        .then((user)=> {if (user == 'root'){restartDatabase().then(feedback_fetch("Y", res))}})
        .catch(() =>{console.log("Failed to restartDatabase")})
})
app.get('/resumeMachine', function(req, res){
    console.log("resumeMachine")
    checkCookie(req,res)
        .then((user)=> {if (req.query['id'] != null){resumeMachine(null, req,res)}else{resumeMachine(user, req, res)}})
        .catch(() =>{console.log("Failed to resumeMachine")})
})

app.get('/suspendMachine', function(req, res){
    console.log("suspendMachine")
    checkCookie(req,res)
        .then((user)=> {if (req.query['id'] != null){suspendMachine(null, req,res)}else{suspendMachine(user, req, res)}})
        .catch(() =>{console.log("Failed to resumeMachine")})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

