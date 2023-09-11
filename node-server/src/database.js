const path = require("path");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var mysql = require("mysql2");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { cloneMachine, modifyMachineVLAN } = require(path.resolve(__dirname, "proxmox.js"));
const emailManager = require(path.resolve(__dirname, "emails.js"));
const { generateRouterOSConfig, eliminateRouterOSConfig } = require(path.resolve(__dirname, "routeros.js"));
var logger = require(path.resolve(__dirname, "logger.js"));
const { feedback_fetch } = require(path.resolve(__dirname, "globalFunctions.js"));

var con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
});

const queryToDB = (sql, params) => {
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) throw err;
            con.query(sql, params, function (err, result) {
                if (err) {
                    logger.info(`Err: ${err}`);
                    reject();
                }
                resolve(result);
            });
        });
    });
};

const getGroups = (res) => {
    sql = `SELECT * FROM nethermir.groups`;
    queryToDB(sql).then((x) => {
        feedback_fetch(JSON.stringify(x), res);
    });
};

const eliminateGroup = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        id = req.query["id"];
        groupName = await getGroupName(id);
        if (groupName == "Failed") {
            logger.error("GroupName not found");
            reject();
        }
        eliminateGroupDatabaseQuery(id).then(resolve(groupName));
    });
};

const getGroupName = (id) => {
    return new Promise((resolve, reject) => {
        sql = `SELECT name FROM nethermir.groups WHERE idgroup=(?)`;
        queryToDB(sql, [id]).then((data) => {
            if (data.length > 0) {
                resolve(data[0].name);
            } else {
                resolve("Failed");
            }
        });
    });
};
const eliminateGroupDatabaseQuery = (id) => {
    return new Promise((resolve, reject) => {
        sql = `DELETE FROM nethermir.groups WHERE idgroup=(?)`;
        queryToDB(sql, [id]).then((x) => {
            resolve("Success");
        });
    });
};

const getEmailsFromGroupName = (groupName, req) => {
    return new Promise((resolve, reject) => {
        if (groupName == null){
            vmID = req.query["id"]
        }else{
            vmID = groupName.split("-").pop()
        }
        sql = `SELECT email FROM nethermir.emails WHERE SUBSTRING(group_name, -3)=(?)`;
        logger.info(`vmID: ${vmID}`)
        queryToDB(sql, [vmID]).then((data) => {
            resolve(data)
        });

    })
}
const getEmails = (res) => {
    sql = `SELECT * FROM nethermir.emails`;
    queryToDB(sql).then((x) => {
        feedback_fetch(JSON.stringify(x), res);
    });
};

const eliminateEmail = (req, res) => {
    id = req.query["id"];
    sql = `DELETE FROM nethermir.emails WHERE email_id=(?)`;
    queryToDB(sql, [id]).then((x) => {

        feedback_fetch("Y", res);
    });
};

const getSubjects = (res) => {
    sql = `SELECT * FROM nethermir.subjects`;
    queryToDB(sql).then((x) => {
        feedback_fetch(JSON.stringify(x), res);
    });
};

const addSubject = async (req, res) => {
    logger.info(`addSubject ${req.query}`);
    id = req.query["id"];
    sql = `INSERT INTO nethermir.subjects (idsubject, subject_name) VALUES (?, ?)`;
    // id.slice(0,-(id.split('-').pop().length + 1)) This monstrocity gets everything before last dash == subject_name
    // Ex: 2022-1-FX-1 -> 2022-1-FX        2023-2-STDW-10 -> 2023-2-STDW
    await queryToDB(sql, [id.split("-").pop(), id.slice(0, -(id.split("-").pop().length + 1))]).catch((x) => logger.info(x));
    feedback_fetch("Y", res);
};
const eliminateSubject = (req, res) => {
    logger.info("eliminateSubject");
    id = req.query["id"];
    sql = `DELETE FROM nethermir.subjects WHERE idsubject=(?)`;
    queryToDB(sql, [parseInt(id)]).then((x) => {
        logger.info(x);
        feedback_fetch("Y", res);
    });
};
const activateSubject = (req, res) => {
    logger.info(`activateSubject ${req.query}`);
    id = req.query["id"];
    sql = `UPDATE nethermir.subjects SET active=(active+1)%2 WHERE idsubject=(?)`;
    queryToDB(sql, [id]).then((x) => {
        logger.info(x);
        feedback_fetch("Y", res);
    });
};

const activateGroup = (id) => {
    logger.info("activateGroup");
    sql = `UPDATE nethermir.groups SET active=(active+1)%2 WHERE idgroup=(?)`;
    queryToDB(sql, [id]).then((x) => {
        logger.info(x);
    });
};

const getGroupData = (groupName) => {
    return new Promise((resolve, reject) => {
        sql = `SELECT idgroup, active, password_login_hash, private_key_router, public_key_user, vlan_id  FROM nethermir.groups WHERE name=?`;
        queryToDB(sql, [groupName]).then(async (data) => {
            if (data.length > 0) {
                resolve(data[0]);
            } else {
                reject();
            }
        });
    });
};

const firstTimeLogin = (user, groupData, req, res) => {
    return new Promise(async (resolve, reject) => {
        cloneRes = await cloneMachine(groupData.idgroup, user)
        //TODO: CLONING DOESNT WORK STILL
        //cloneRes = "Success";
        if (cloneRes == "Success") {
            logger.info("Clone success!");
            bridge = process.env.PROXMOX_PUBLIC_BRIDGE
            modifyMachineVLAN(user, groupData.idgroup, bridge, req, res);
            portUDP = parseInt(process.env.PORT_UDP_FIRST_ID) + parseInt(groupData.vlan_id);
            activateGroup(groupData.idgroup);
            generateRes = await generateRouterOSConfig(user, groupData.private_key_router, groupData.public_key_user, portUDP, process.env.ROUTEROS_TO_PROXMOX_INTERFACE_NAME, groupData.idgroup);
            if (generateRes == "Success") {
                resolve(user);
            } else {
                eliminateRes = await eliminateRouterOSConfig(user);
                feedback_fetch("Generating router config failed - Contact Professor", res);
                resolve()
            }
        } else {
            feedback_fetch("Clonning failed - Contact Professor", res);
            resolve()
        }
    });
};
const authenticate = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        user = req.query["user"];
        pass = req.query["pass"];
        if (user.startsWith(process.env.ROOT_USER) && pass == process.env.ROOT_PASS) {
            resolve("root");
        } else {
            logger.info("Authenticate before query");
            try {
                groupData = await getGroupData(user);
                logger.info(groupData);
                auth = await bcrypt.compare(pass, groupData.password_login_hash);
                logger.info(auth);
                if (auth) {
                    resolve(user);
                }
            } catch {
                feedback_fetch("Error", res)
                reject()
            }
        }
    });
};

const generateMachine = async (user, req, res) => {
    return new Promise(async (resolve, reject) => {
        groupData = await getGroupData(user);
        if (groupData.active == 0) {
            firstTimeLogin(user, groupData, req, res).then(logger.info("yes")).catch(logger.info)
        }
    })
}
const insertGroup = (idGroup, groupName, password_login_hash, privateKeyRouter, publicKeyUser, res) => {
    return new Promise((resolve, reject) => {
        logger.info("insertGroup started");
        logger.info(`${idGroup}, ${groupName}, ${password_login_hash}, ${privateKeyRouter}, ${publicKeyUser}`)
        sql = `INSERT INTO nethermir.groups (idgroup, name, password_login_hash, private_key_router, public_key_user) VALUES (?, ?, ?, ?, ?)`;
        queryToDB(sql, [idGroup, groupName, password_login_hash, privateKeyRouter, publicKeyUser])
            .then(resolve)
            .catch((err) => {
                feedback_fetch(`Insert Group failed sql${err}`, res);
                resolve();
            });
    });
};

const getEndpointPortGroup = (idGroup) => {
    return new Promise(async (resolve, reject) => {
        sql = `SELECT vlan_id FROM nethermir.groups WHERE idgroup = (?)`;
        data = await queryToDB(sql, [idGroup]);
        endpointPort = parseInt(data[0]["vlan_id"]) + parseInt(process.env.PORT_UDP_FIRST_ID);
        resolve(endpointPort);
    });
};

const insertEmails = (emails, groupName, res) => {
    return new Promise((resolve, reject) => {
        let promises = [];
        sql = `INSERT INTO nethermir.emails (email, group_name) VALUES (?, ?) `;
        emails.forEach((email) =>
            promises.push(
                queryToDB(sql, [email, groupName])
                    .then(logger.info("Email Registrat"))
                    .catch((x) => feedback_fetch("Error mySQL nethermir.groups: " + x, res))
            )
        );
        Promise.all(promises).then(resolve);
    });
};
const registerGroup = async (req, res) => {
    logger.info("Register Iniciated");
    emails = req.query["email"].split("xv3dz1g");
    checkRes = await checkEmails(emails, res);
    if (checkRes != "Correct") {
        feedback_fetch(checkRes, res);
        return 0;
    }
    idGroup = await generateGroup(req.query["user"]);
    groupName = req.query["user"] + "-" + idGroup;
    [password, paswordHash] = await generatePassword();
    [keyPairUser, keyPairRouter] = await genKeyPairVLAN();
    await insertGroup(idGroup, groupName, paswordHash, keyPairRouter.prv, keyPairUser.pub, res);
    await insertEmails(emails, groupName, res);
    portUDP = await getEndpointPortGroup(idgroup)
    emailManager.sendPasswordEmail(emails, groupName, portUDP, password, keyPairUser, keyPairRouter);
    feedback_fetch("Y", res);
};

function generateGroup(user) {
    return new Promise(async (resolve, reject) => {
        sql = `SELECT idsubject FROM nethermir.subjects WHERE subject_name = (?)`;
        idsubject = await queryToDB(sql, [user]);
        idsubject = idsubject[0]["idsubject"];
        sql = `SELECT MAX(idgroup) as idgroup_max FROM nethermir.groups WHERE (idgroup - (idgroup MOD 100)) /100 = (?) `;
        idgroups = await queryToDB(sql, [idsubject]);
        idgroups = idgroups[0]["idgroup_max"];
        if (idgroups != null) {
            idgroup = idgroups + 1;
        } else {
            idgroup = idsubject * 100;
        }
        resolve(idgroup);
    });
}

function generatePassword() {
    return new Promise((resolve, reject) => {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        bcrypt.hash(retVal, 10, (err, hash) => {
            if (err) {
                logger.error(`Error hashing ${err}`)
            }
            resolve([retVal, hash]);
        })
    });
}

const checkEmails = (emails) => {
    return new Promise((resolve, reject) => {
        elements = 0;
        emails.forEach(async (email) => {
            if (!email.endsWith("@uab.cat")) {
                resolve("Doesn't end in @uab.cat");
            }
            sql = `SELECT email FROM nethermir.emails WHERE email=?`;
            queryToDB(sql, [email]).then((x) => {
                if (x.length != 0) {
                    resolve(`Email ${email} already in database`);
                }
                if (elements == emails.length - 1) {
                    resolve("Correct");
                }
                elements = elements + 1;
            });
        });
    });
};

const restartDatabase = async () => {
    return new Promise(async (resolve, reject) => {
        sql = `DROP SCHEMA IF EXISTS nethermir;       
        `;
        await queryToDB(sql);
        sql = `CREATE SCHEMA nethermir; `;
        await queryToDB(sql);
        sql = `CREATE TABLE nethermir.groups (
            idgroup INT NOT NULL,
            name VARCHAR(45) NOT NULL,
            password_login_hash VARCHAR(60) NULL,
            public_key_user VARCHAR(60) NULL,
            private_key_router VARCHAR(60) NULL,
            active TINYINT NULL DEFAULT 0,
            vlan_id INT NOT NULL AUTO_INCREMENT,
            PRIMARY KEY (vlan_id),
            UNIQUE INDEX idgroup_UNIQUE (idgroup ASC) VISIBLE,
            UNIQUE INDEX name_UNIQUE (name ASC) VISIBLE,
            UNIQUE INDEX password_login_hash_UNIQUE (password_login_hash ASC) VISIBLE);`;
        await queryToDB(sql);
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
              ON UPDATE CASCADE);`;
        await queryToDB(sql);
        sql = `CREATE TABLE nethermir.subjects (
            idsubject INT NOT NULL,
            subject_name VARCHAR(45) NULL,
            active TINYINT NULL DEFAULT 0,
            PRIMARY KEY (idsubject));`;
        await queryToDB(sql);
    });
};

const genKeyPairVLAN = () => {
    return new Promise(async (resolve, reject) => {
        keyPairUser = await genKeyPair();
        keyPairRouter = await genKeyPair();
        resolve([keyPairUser, keyPairRouter]);
    });
};

const genKeyPair = () => {
    return new Promise((resolve, reject) => {
        let k = crypto.generateKeyPairSync("x25519", {
            publicKeyEncoding: { format: "der", type: "spki" },
            privateKeyEncoding: { format: "der", type: "pkcs8" },
        });

        resolve({
            pub: k.publicKey.subarray(12).toString("base64"),
            prv: k.privateKey.subarray(16).toString("base64"),
        });
    });
};

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
    genKeyPairVLAN,
    generateMachine,
    getEmailsFromGroupName,
};
