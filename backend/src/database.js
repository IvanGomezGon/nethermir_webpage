const path = require('path');
const bcrypt = require("bcrypt")
var mysql = require('mysql2');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const {cloneMachine} = require(path.resolve(__dirname, 'proxmox.js'))
const  {sendPasswordEmail} = require(path.resolve(__dirname, 'emails.js'))
const feedback_fetch = (text, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    res.write(text); 
    res.end();
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

const getGroups = (res) => {    
    sql = `SELECT * FROM docente.groups`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const eliminateGroup = (req, res) => {
    id = req.query['user'].split('root')[1];
    console.log(id)
    sql = `DELETE FROM docente.groups WHERE idgroup=(?)`
    queryToDB(sql, [id]).then(x =>{console.log(x);feedback_fetch("Y", res)})
}

const getEmails = (res) => {    
    sql = `SELECT * FROM docente.emails`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const eliminateEmail = (req, res) => {
    id = req.query['user'].split('root')[1];
    console.log(id)
    sql = `DELETE FROM docente.emails WHERE email_id=(?)`
    queryToDB(sql, [id]).then(x =>{console.log(x);feedback_fetch("Y", res)})
}

const getSubjects = (res) => {  
    console.log("getSubjects")  
    sql = `SELECT * FROM docente.subjects`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const addSubject = (req,res) => {
    console.log("addSuybject", req.query)
    id = req.query['id'];
    console.log(id)
    sql = `INSERT INTO docente.subjects (idsubjects, subject_name) VALUES (?, ?)` 
    queryToDB(sql, [id.slice(-3),id]).then(x =>{console.log(x);feedback_fetch("Y", res)})
}
const eliminateSubject = (req, res) => {
    console.log("eliminateSubject")
    id = req.query['user'].split('root')[1];
    console.log(id)
    sql = `DELETE FROM docente.subjects WHERE idsubjects=(?)`
    queryToDB(sql, [id]).then(x =>{console.log(x);feedback_fetch("Y", res)})
}
const activateSubject = (req,res) => {
    console.log("activateSubject", req.query)
    id = req.query['id'];
    console.log(id)
    sql = `UPDATE docente.subjects SET active=(active+1)%2 WHERE idsubjects=(?)` 
    queryToDB(sql, [id]).then(x =>{console.log(x);feedback_fetch("Y", res)})
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

function generateGroup(user) {
    return new Promise((resolve, reject) => {
        idgroup = 0
        sql = `SELECT idgroup FROM docente.groups ORDER BY idgroup DESC LIMIT 1`                
        idgroup =queryToDB(sql).then(x => {if (x.length>0){idgroup = 101+x[0].idgroup;}else{idgroup = 101} resolve(user+'-'+idgroup)})
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

const restartDatabase = async() =>{
    return new Promise(async (resolve, reject) => {
        sql = `DROP SCHEMA IF EXISTS docente;       
        ` 
        await queryToDB(sql)
        sql = `CREATE SCHEMA docente; `  
        await queryToDB(sql)
        sql = `CREATE TABLE docente.groups (
            idgroup INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(45) NOT NULL,
            p_hash VARCHAR(60) NULL,
            PRIMARY KEY (idgroup),
            UNIQUE INDEX idgroup_UNIQUE (idgroup ASC) VISIBLE,
            UNIQUE INDEX name_UNIQUE (name ASC) VISIBLE,
            UNIQUE INDEX p_hash_UNIQUE (p_hash ASC) VISIBLE);       
          ` 
        await queryToDB(sql)  
        sql = `CREATE TABLE docente.emails (
            email_id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL,
            group_name VARCHAR(45) NOT NULL,
            PRIMARY KEY (email_id),
            INDEX group_name_idx (group_name ASC) VISIBLE,
            CONSTRAINT group_name
              FOREIGN KEY (group_name)
              REFERENCES docente.groups (name)
              ON DELETE CASCADE
              ON UPDATE CASCADE);`
        await queryToDB(sql)      
        sql = `CREATE TABLE docente.subjects (
            idsubjects INT NOT NULL,
            subject_name VARCHAR(45) NULL,
            active TINYINT NULL DEFAULT 0,
            PRIMARY KEY (idsubjects));`
        await queryToDB(sql) 
        
    })
}

module.exports = {
    getGroups,
    getEmails,
    eliminateGroup,
    eliminateEmail,
    authenticate,
    registerGroup,
    restartDatabase, 
    getSubjects, 
    eliminateSubject,
    addSubject,
    activateSubject,
 }



