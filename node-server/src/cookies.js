const jwt = require('jsonwebtoken')
const path = require('path');
var logger = require(path.resolve(__dirname, 'logger.js'))


const feedback_fetch = (text, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); 
    res.write(text); 
    res.end();
} 

const setCookie = (type, res) => {
    const token = jwt.sign({user: type}, process.env.COOKIE_PASSWORD, {expiresIn: "1h"})
    res.cookie("token", token, {
        httpOnly: true,
        Path:"/",
    })
    logger.info("Setting cookie", token)
    if (type != 'root') {feedback_fetch('user', res)}
    else {feedback_fetch(type, res)}
}

const checkCookie = (req, res) => {
    return new Promise((resolve, reject) => {
        const token = req.cookies.token
        try{
            jwt.verify(token, process.env.COOKIE_PASSWORD, function (err, payload){
                if (err){logger.info("Error verifiying token"); reject()}
                resolve(payload.user)
            })
        }catch (err){
            logger.info("no cookie")
            res.clearCookie("token")
            feedback_fetch('failed-login', res)
            reject()
        }
    })  
}
const eliminateCookie = (req, res) => {
    res.clearCookie("token")
    feedback_fetch('y', res)
}

module.exports = {
    setCookie,
    checkCookie,
    eliminateCookie,
 }

