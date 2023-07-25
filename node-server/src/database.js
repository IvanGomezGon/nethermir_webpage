const path = require('path');
const bcrypt = require("bcrypt")
var mysql = require('mysql2');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const {cloneMachine} = require(path.resolve(__dirname, 'proxmox.js'))
const  {sendPasswordEmail} = require(path.resolve(__dirname, 'emails.js'))
const {setCookie} = require(path.resolve(__dirname, 'cookies.js'))
const winston = require('winston')
const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log'}),
        new winston.transports.Console({format: winston.format.simple()})
    ],
})

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
            
            con.query(sql, params, function (err, result) {
            if (err) {logger.info("Err:", err); reject()};
            resolve(result);
            });
        });

    })
}

const getGroups = (res) => {    
    sql = `SELECT * FROM nethermir.groups`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const eliminateGroup = (req, res) => {
    id = req.query['id'];
    sql = `DELETE FROM nethermir.groups WHERE idgroup=(?)`
    queryToDB(sql, [id]).then(x =>{feedback_fetch("Y", res)})
}

const getEmails = (res) => {    
    sql = `SELECT * FROM nethermir.emails`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const eliminateEmail = (req, res) => {
    id = req.query['id'];
    sql = `DELETE FROM nethermir.emails WHERE email_id=(?)`
    queryToDB(sql, [id]).then(x =>{feedback_fetch("Y", res)})
}

const getSubjects = (res) => {  
    sql = `SELECT * FROM nethermir.subjects`
    queryToDB(sql).then(x =>{feedback_fetch(JSON.stringify(x), res)})
}

const addSubject = async (req,res) => {
    logger.info("addSubject", req.query)
    id = req.query['id'];
    sql = `INSERT INTO nethermir.subjects (idsubject, subject_name) VALUES (?, ?)` 
    // id.slice(0,-(id.split('-').pop().length + 1)) This monstrocity gets everything before last dash == subject_name 
    // Ex: 2022-1-FX-1 -> 2022-1-FX        2023-2-STDW-10 -> 2023-2-STDW 
    await queryToDB(sql, [id.split('-').pop(), id.slice(0,-(id.split('-').pop().length + 1))]).catch(x=>logger.info(x))
    feedback_fetch("Y", res)
}
const eliminateSubject = (req, res) => {
    logger.info("eliminateSubject")
    id = req.query['id'];
    sql = `DELETE FROM nethermir.subjects WHERE idsubject=(?)`
    queryToDB(sql, [parseInt(id)]).then(x =>{logger.info(x);feedback_fetch("Y", res)})
}
const activateSubject = (req,res) => {
    logger.info("activateSubject", req.query)
    id = req.query['id'];
    sql = `UPDATE nethermir.subjects SET active=(active+1)%2 WHERE idsubject=(?)` 
    queryToDB(sql, [id]).then(x =>{logger.info(x);feedback_fetch("Y", res)})
}

const activateGroup = (id) => {
    logger.info("activateGroup")
    sql = `UPDATE nethermir.groups SET active=(active+1)%2 WHERE idgroup=(?)` 
    queryToDB(sql, [id]).then(x =>{logger.info(x)})
}

const authenticate = async(req, res) => {
    return new Promise ((resolve, reject) => {
        user = req.query['user']
        pass = req.query['pass']
        pass_hash =""
        if (user.startsWith(process.env.ROOT_USER) && pass == process.env.ROOT_PASS){
            resolve("root")
        }else{
        sql = `SELECT idgroup, active, p_hash FROM nethermir.groups WHERE name=?`            
        queryToDB(sql, [user]).then(async x =>{
            if (x.length > 0){
                pass_hash = x[0].p_hash
                auth = await bcrypt.compare(pass, pass_hash);
                if (auth){
                    if (x[0].active != 1){
                        cloneRes = await cloneMachine(x[0].idgroup)
                        if (cloneRes == "Success") {activateGroup(x[0].idgroup); resolve(user)}
                        else {
                            feedback_fetch("Clonning failed - Contact Professor", res)
                            reject()
                        }
                            
                    }else{
                        resolve(user)
                    }
                }   
            }
            reject()
        })}
    })    
}

const registerGroup = async (req, res) => {
    user = req.query['user']
    emails = (req.query['email']).split('xv3dz1g')
    password = generatePassword()
    idgroup = await generateGroup(user)
    nameGroup = user + '-' + idgroup
    p_hash = await bcrypt.hash(password, 10);
    feedback_check = await checkEmails(emails, res)
    if (feedback_check != "Correct"){
        feedback_fetch(feedback_check, res)
        return 0
    }
    let promises = [];
    sql = `INSERT INTO nethermir.groups (idgroup, name, p_hash) VALUES (?, ?, ?)`                       
    promises.push(queryToDB(sql, [idgroup, nameGroup, p_hash])
            .then(logger.info("Group Registrat"))
            .catch(x=>feedback_fetch("Error mySQL nethermir.groups: " + x, res)))
    sql = `INSERT INTO nethermir.emails (email, group_name) VALUES (?, ?) `
    
    emails.forEach(email => promises.push(queryToDB(sql, [email, nameGroup])
        .then(logger.info("Email Registrat"))
        .catch(x=>feedback_fetch("Error mySQL nethermir.groups: " + x, res)))) 

    Promise.all(promises).then(async () =>{
        sendPasswordEmail(emails, nameGroup, idgroup, password)
        feedback_fetch("Y", res)           
    })
}

function  generateGroup (user) {
    return new Promise(async (resolve, reject) => {
        sql = `SELECT idsubject FROM nethermir.subjects WHERE subject_name = (?)` 
        idsubject = await queryToDB(sql, [user])
        idsubject = idsubject[0]['idsubject']
        sql = `SELECT MAX(idgroup) as idgroup_max FROM nethermir.groups WHERE (idgroup - (idgroup MOD 100)) /100 = (?) `                
        idgroups = await queryToDB(sql, [idsubject])
        idgroups = idgroups[0]['idgroup_max']
        if (idgroups != null){idgroup = idgroups+1;}
        else {idgroup = idsubject*100;}
        resolve(idgroup)
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
            sql = `SELECT email FROM nethermir.emails WHERE email=?`
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
        sql = `DROP SCHEMA IF EXISTS nethermir;       
        ` 
        await queryToDB(sql)
        sql = `CREATE SCHEMA nethermir; `  
        await queryToDB(sql)
        sql = `CREATE TABLE nethermir.groups (
            idgroup INT NOT NULL,
            name VARCHAR(45) NOT NULL,
            p_hash VARCHAR(60) NULL,
            active TINYINT NULL DEFAULT 0,
            vlan_id INT NOT NULL AUTO_INCREMENT,
            PRIMARY KEY (vlan_id),
            UNIQUE INDEX idgroup_UNIQUE (idgroup ASC) VISIBLE,
            UNIQUE INDEX name_UNIQUE (name ASC) VISIBLE,
            UNIQUE INDEX p_hash_UNIQUE (p_hash ASC) VISIBLE);` 
        await queryToDB(sql)  
        sql = `CREATE TABLE nethermir.emails (
            email_id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL,
            group_name VARCHAR(45) NOT NULL,
            PRIMARY KEY (email_id),
            INDEX group_name_idx (group_name ASC) VISIBLE,
            CONSTRAINT group_name
              FOREIGN KEY (group_name)
              REFERENCES nethermir.groups (name)
              ON DELETE CASCADE
              ON UPDATE CASCADE);`
        await queryToDB(sql)      
        sql = `CREATE TABLE nethermir.subjects (
            idsubject INT NOT NULL,
            subject_name VARCHAR(45) NULL,
            active TINYINT NULL DEFAULT 0,
            PRIMARY KEY (idsubject));`
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



