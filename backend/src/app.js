const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
console.log(process.env)
const express = require('express');

const nodeMailer = require('nodemailer');
const cors=require('cors');
const crypto = require('crypto');
const bcrypt = require("bcrypt")
var mysql = require('mysql2');
const proxmox = require('proxmox')(process.env.PROXMOX_USER, process.env.PROXMOX_PASS, process.env.PROXMOX_DOM)

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const sendEmail = async (sendTo, txt) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }  
    });
    const info = await transporter.sendMail({
        from: 'UAB <ivangg02@gmail.com>',
        to: sendTo,
        subject: 'Config wireguard ',
        html: txt,           
    })
    console.log("Message sent to: " + sendTo);
}

const genKeyPair = () => {
    let k = crypto.generateKeyPairSync("x25519", {
        publicKeyEncoding: { format: "der", type: "spki" },
        privateKeyEncoding: { format: "der", type: "pkcs8" }
    });

    return {
        pub: k.publicKey.subarray(12).toString("base64"),
        prv: k.privateKey.subarray(16).toString("base64")
    };
};

const activateMachineMain = (req, res) =>{
    if (req.query['hours']<1) {feedback_fetch("N", res); return 0;}
    vmID = req.query['user'].slice(-3);
    console.log(`Activating machine ${vmID}`)
    proxmox.qemu.start("pve", vmID, (err, data)=>{feedback_fetch("Y", res)})
    setTimeout(function(){sendWarningMail(req.query['user'])}, req.query['hours']*3600000-1800000)
    setTimeout(function(){sendWarningMail(req.query['user'])}, 1800000)
}

const sendWarningMail = (user) =>{
    //Query for group email
    emails = ["ivangg02@gmail.com", "ivangg1202@gmail.com"]
    emailText = `Bon dia, la vostra VM serà apagada en 30 minuts
                `
    emails.forEach(email => sendEmail(email, emailText))
}
const stopMachineMain = (req, res) =>{
    vmID = req.query['user'].slice(-3);
    console.log(`Activating machine ${req.query['node']}`)
    proxmox.qemu.stop("pve", vmID, (err, data)=>{feedback_fetch("Y", res)})    
}
const getNodesMain = (res) => {
    proxmox.getQemu("pve",(err, data) =>{
        if (err) {console.log("mal")}
        else{
            data_json = JSON.parse(data).data
            data_json.sort((a,b) => a['vmid'] - b['vmid'])
            feedback_fetch(JSON.stringify(data_json), res)
        }
    })
}

const getNodeMain = (req, res) => {
    vmID = req.query['user'].slice(-3);
    proxmox.qemu.getStatusCurrent("pve",vmID,(err, data) =>{
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
        proxmox.qemu.clone("pve", 100,newID, (err, data)=>{
            if (err){resolve("Failed")}
            if (data){resolve("Success")}
        }) 
    })
}

const getGroups = (res) => {    
    sql = `SELECT * FROM docente.groups`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const getEmails = (res) => {    
    sql = `SELECT * FROM docente.emails`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const eliminateGroup = (req, res) => {
    id = req.query['user'].split('root')[1];
    console.log(id)
    sql = `DELETE FROM docente.groups WHERE idgroup=(?)`
    queryToDB(sql, [id]).then(x =>{console.log(x);feedback_fetch("Y", res)})
}

const eliminateEmail = (req, res) => {
    id = req.query['user'].split('root')[1];
    console.log(id)
    sql = `DELETE FROM docente.emails WHERE email_id=(?)`
    queryToDB(sql, [id]).then(x =>{console.log(x);feedback_fetch("Y", res)})
}

const registerGroup = async (req, res) => {
    user = req.query['user']
    emails = (req.query['email']).split('xv3dz1g')
    console.log(emails)

    password = generatePassword()
    group = await generateGroup(user)
    p_hash = await bcrypt.hash(password, 10);
    feedback_check = await checkEmails(emails, res)
    if (feedback_check != "Correct"){
        feedback_fetch(feedback_check, res)
        return 0
    }
    let promises = [];
    sql = `INSERT INTO docente.groups (name, p_hash) VALUES (?, ?)`                       
    promises.push(queryToDB(sql, [group, p_hash])
            .then(console.log("Group Registrat"))
            .catch(x=>feedback_fetch("Error mySQL docente.groups: " + x, res)))
    sql = `INSERT INTO docente.emails (email, group_name) VALUES (?, ?) `
    
    emails.forEach(email => promises.push(queryToDB(sql, [email, group])
        .then(console.log("Email Registrat"))
        .catch(x=>feedback_fetch("Error mySQL docente.groups: " + x, res)))) 
    
    Promise.all(promises).then(() =>{
        cloneMachine(group).then(clone_res=>{
            if (clone_res == "Success") {
                sendPasswordEmail(emails, group, password)
                feedback_fetch("Y", res)
            }else{
                feedback_fetch("Error cloning the machine", res)
            }
        }) 
        
        
    })
}

const sendPasswordEmail = (emails, group, password) => {
    id = group.slice(-3);
    id = id-100
    console.log(id)
    keyPair = genKeyPair()
    emailText = `Bon dia grup ${group}, la vostra contrasenya serà: ${password} 
                interfaceAdr: 10.1.${id}.2/30
                allowedIPs:  10.1.${id}.2/30  10.0.${id}.0/30
                endpoint: xxxx:${38980+id}
                pubkey: ${keyPair.pub}
                privkey:${keyPair.prv}`
    console.log(emailText)
    emails.forEach(email=>{ sendEmail(email, emailText) })

}

const checkEmails = (emails) =>{
    return new Promise ((resolve, reject) => {
        elements = 0
        emails.forEach(async email=>{
            if (!email.endsWith('@uab.cat')) {resolve("Doesn't end in @uab.cat")}
            sql = `SELECT email FROM docente.emails WHERE email=?`
            queryToDB(sql, [email]).then(x =>{ 
                if (x.length != 0){resolve(`Email ${email} already in database`)}
                if (elements == emails.length-1) {resolve("Correct")}
                elements = elements+1
            })
        })
    })
}
const authenticate = async(req, res) => {
    return new Promise ((resolve, reject) => {
        user = req.query['user']
        pass = req.query['pass']
        pass_hash =""
        if (user.startsWith(process.env.ROOT_USER) && pass == process.env.ROOT_PASS){
            resolve()
        }else{
        sql = `SELECT p_hash FROM docente.groups WHERE name=?  `            
        queryToDB(sql, [user]).then(async x =>{
            console.log(x)
            if (x.length > 0){
                pass_hash = x[0].p_hash
                console.log("Password_hash: ", pass_hash, "Password: ", pass)
                auth = await bcrypt.compare(pass, pass_hash);
                console.log("auth: ", auth)
                if (auth){resolve()}   
            }
            reject()
       
        })}
    })    
}

function generateGroup(user) {
    return new Promise((resolve, reject) => {
        idgroup = 0
        sql = `SELECT idgroup FROM docente.groups ORDER BY idgroup DESC LIMIT 1`                
        idgroup =queryToDB(sql).then(x => {idgroup = 101+x[0].idgroup; resolve(user+'-'+idgroup)})
    })
}
function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}





var con = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS
});

const queryToDB = (sql, params) => {
    return new Promise((resolve, reject) =>{
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            
            con.query(sql, params, function (err, result) {
              if (err) {console.log(err); reject()};
              resolve(result);
            });
          });

    })
}

const feedback_fetch = (text, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    res.write(text); 
    res.end();
} 



const app = express()
const port = 8081
app.use(cors(corsOptions)) 

app.get('/sendMail', function(req, res){
    sendMailMain(req, res)
});
app.get('/activateMachine', function(req, res){
    authenticate(req).then(()=>{activateMachineMain(req,res)}).catch(()=>{console.log("Failed to authenticate")})
})
app.get('/stopMachine', function(req, res){
    authenticate(req).then(()=>{stopMachineMain(req,res)}).catch(()=>{console.log("Failed to authenticate")})
})
app.get('/login', function(req, res){
    authenticate(req).then(()=> {feedback_fetch("Login succesfull!", res)}).catch(() => {feedback_fetch("Invalid email or Password", res)})  
})
app.get('/register', function(req, res){
    registerGroup(req, res)
})
app.get('/getNodes', function(req, res){
    authenticate(req).then(()=> {getNodesMain(res)})
   
})
app.get('/getNode', function(req, res){
    authenticate(req).then(()=> {getNodeMain(req, res)})
   
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
app.get('/eliminateEmails', function(req, res){
    authenticate(req).then(()=> {eliminateEmail(req, res)})
   
})


app.use(express.static(path.join(__dirname, '../../frontend/public')))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

