const jwt = require("jsonwebtoken");
const path = require("path");
var logger = require(path.resolve(__dirname, "logger.js"));
const {feedbackFetch} = require(path.resolve(__dirname, "globalFunctions.js"));

const setCookie = (type, res) => {
    const token = jwt.sign({ user: type }, process.env.COOKIE_PASSWORD, {
        expiresIn: "1h",
    });
    res.cookie("token", token, {
        httpOnly: true,
        Path: "/",
    });
    logger.info(`Setting cookie ${token}`);
    if (type != "root") {
        feedbackFetch("user", res);
    } else {
        feedbackFetch(type, res);
    }
};

const checkCookie = (req, res) => {
    return new Promise((resolve, reject) => {
        const token = req.cookies.token;
        try {
            jwt.verify(token, process.env.COOKIE_PASSWORD, function (err, payload) {
                if (err) {
                    logger.info("Error verifiying token");
                    reject();
                }
                resolve(payload.user);
            });
        } catch (err) {
            logger.info("no cookie");
            res.clearCookie("token");
            reject();
        }
    });
};
const eliminateCookie = (res) => {
    res.clearCookie("token");
    feedbackFetch("", res);
};

module.exports = {
    setCookie,
    checkCookie,
    eliminateCookie,
};
