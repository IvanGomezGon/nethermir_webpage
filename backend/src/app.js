const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const express = require('express');
const cors=require('cors');

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const feedback_fetch = (text, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    res.write(text); 
    res.end();
} 
const {activateMachine, stopMachine, getNodes, getNode, resumeMachine, suspendMachine} = require(path.resolve(__dirname, 'proxmox.js'))
const {getGroups, getEmails, eliminateGroup, eliminateEmail, authenticate, registerGroup, restartDatabase} = require (path.resolve(__dirname, 'database.js'))

const app = express()
const port = process.env.LISTENING_PORT
app.use(cors(corsOptions)) 

app.get('/activateMachine', function(req, res){
    authenticate(req).then(()=>{activateMachine(req,res)}).catch(()=>{console.log("Failed to authenticate")})
})
app.get('/stopMachine', function(req, res){
    authenticate(req).then(()=>{stopMachine(req,res)}).catch(()=>{console.log("Failed to authenticate")})
})
app.get('/login', function(req, res){
    authenticate(req).then(()=> {feedback_fetch("Login succesfull!", res)}).catch(() => {feedback_fetch("Invalid email or Password", res)})  
})
app.get('/register', function(req, res){
    registerGroup(req, res)
})
app.get('/getNodes', function(req, res){
    authenticate(req).then(()=> {getNodes(res)})
   
})
app.get('/getNode', function(req, res){
    authenticate(req).then(()=> {getNode(req, res)})
   
})
app.get('/getGroups', function(req, res){
    authenticate(req).then(()=> {getGroups(res)})
   
})
app.get('/eliminateGroup', function(req, res){
    authenticate(req).then(()=> {eliminateGroup(req, res)})
   
})
app.get('/getEmails', function(req, res){
    authenticate(req).then(()=> {getEmails(res)})
   
})
app.get('/eliminateEmail', function(req, res){
    authenticate(req).then(()=> {eliminateEmail(req, res)})
   
})
app.get('/restartDatabase', function(req, res){
    authenticate(req).then(()=> {restartDatabase().then(feedback_fetch("Y", res))})
})
app.get('/resumeMachine', function(req, res){
    authenticate(req).then(()=> {resumeMachine(req,res)})
})
app.get('/suspendMachine', function(req, res){
    authenticate(req).then(()=> {suspendMachine(req,res)})
})
app.use(express.static(path.join(__dirname, '../../frontend/public')))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

