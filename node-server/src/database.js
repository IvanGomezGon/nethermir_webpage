const path = require("path");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var mysql = require("mysql2");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
var logger = require(path.resolve(__dirname, "logger.js"));

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

//GROUPS 

const getGroups = () => {
    return new Promise((resolve, reject) => {
        sql = `SELECT * FROM nethermir.groups`;
        queryToDB(sql).then((x) => {
            resolve(JSON.stringify(x));
        });
    })
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

const getEndpointPortGroup = (idGroup) => {
    return new Promise(async (resolve, reject) => {
        sql = `SELECT vlan_id FROM nethermir.groups WHERE idgroup = (?)`;
        data = await queryToDB(sql, [idGroup]);
        endpointPort = parseInt(data[0]["vlan_id"]) + parseInt(process.env.PORT_UDP_FIRST_ID);
        resolve(endpointPort);
    });
};

const insertGroup = (idGroup, groupName, password_login_hash, privateKeyRouter, publicKeyUser) => {
    return new Promise((resolve, reject) => {
        logger.info("insertGroup started");
        logger.info(`${idGroup}, ${groupName}, ${password_login_hash}, ${privateKeyRouter}, ${publicKeyUser}`)
        sql = `INSERT INTO nethermir.groups (idgroup, name, password_login_hash, private_key_router, public_key_user) VALUES (?, ?, ?, ?, ?)`;
        queryToDB(sql, [idGroup, groupName, password_login_hash, privateKeyRouter, publicKeyUser])
            .then(resolve)
    });
};

const eliminateGroup = async (id) => {
    return new Promise(async (resolve, reject) => {
        groupName = await getGroupName(id);
        if (groupName == "Failed") {
            logger.error("GroupName not found");
            reject("GroupName not found");
        }
        eliminateGroupDatabaseQuery(id).then(resolve());
    });
};

const activateGroup = (id) => {
    return new Promise((resolve, reject) => {
        logger.info("activateGroup");
        sql = `UPDATE nethermir.groups SET active=(active+1)%2 WHERE idgroup=(?)`;
        queryToDB(sql, [id]).then((x) => {
            logger.info(x);
        });
    })

};

const eliminateGroupDatabaseQuery = (id) => {
    return new Promise((resolve, reject) => {
        sql = `DELETE FROM nethermir.groups WHERE idgroup=(?)`;
        queryToDB(sql, [id]).then((x) => {
            resolve("Success");
        });
    });
};

//GROUP VM 
const getStartingTimeVM = (idGroup) => {
    return new Promise(async (resolve, reject) => {
        sql = `SELECT starting_time FROM nethermir.groups WHERE idgroup = (?)`;
        data = await queryToDB(sql, [idGroup]);
        startingTime = data[0]["starting_time"]
        resolve(startingTime);
    })
}
const getRenovationHoursVM = (idGroup) => {
    return new Promise(async (resolve, reject) => {
        sql = `SELECT renovated_hours FROM nethermir.groups WHERE idgroup = (?)`;
        data = await queryToDB(sql, [idGroup]);
        if (data == null){
            reject(`Couldn't find link VirtualMachine - Group Database`)
        }
        renovationHours = data[0]["renovated_hours"]
        logger.info(`Renovation hours: ${renovationHours}`)
        resolve(renovationHours);
    })
}

const changeRenovationHoursVM = (idGroup, active, hours) => {
    return new Promise((resolve, reject) => {
        if (active == false) {
            sql = `UPDATE nethermir.groups SET renovated_hours = (?), starting_time = now() WHERE idgroup = (?)`;
        } else {
            sql = `UPDATE nethermir.groups SET renovated_hours=renovated_hours + (?) WHERE idgroup = (?)`;
        }
        queryToDB(sql, [hours, idGroup]).then((x) => {
            logger.info(`changedRenovationHours`);
            resolve()
        });
    })
}
//EMAILS
const getEmailsFromGroupName = (groupName, id) => {
    return new Promise((resolve, reject) => {
        if (groupName == null) {
            vmID = id
        } else {
            vmID = groupName.split("-").pop()
        }
        sql = `SELECT email FROM nethermir.emails WHERE SUBSTRING(group_name, -3)=(?)`;
        logger.info(`vmID: ${vmID}`)
        queryToDB(sql, [vmID]).then((data) => {
            resolve(data)
        });

    })
}
const getEmails = () => {
    return new Promise((resolve, reject) => {
        sql = `SELECT * FROM nethermir.emails`;
        queryToDB(sql).then((x) => {
            resolve(JSON.stringify(x));
        });
    })
};
const eliminateEmail = (id) => {
    return new Promise((resolve, reject) => {
        sql = `DELETE FROM nethermir.emails WHERE email_id=(?)`;
        queryToDB(sql, [id]).then((x) => {
            resolve();
        });
    })
};


//SUBJECTS
const getSubjects = () => {
    return new Promise((resolve, reject) => {
        sql = `SELECT * FROM nethermir.subjects`;
        queryToDB(sql).then((x) => {
            resolve(JSON.stringify(x));
        });
    })
};

const addSubject = async (id) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`addSubject ${id}`);
        sql = `INSERT INTO nethermir.subjects (idsubject, subject_name) VALUES (?, ?)`;
        // id.slice(0,-(id.split('-').pop().length + 1)) This monstrocity gets everything before last dash == subject_name
        // Ex: 2022-1-FX-1 -> 2022-1-FX        2023-2-STDW-10 -> 2023-2-STDW
        await queryToDB(sql, [id.split("-").pop(), id.slice(0, -(id.split("-").pop().length + 1))]).catch((x) => logger.info(x));
        resolve();
    })
};
const eliminateSubject = (id) => {
    return new Promise((resolve, reject) => {
        logger.info("eliminateSubject");
        sql = `DELETE FROM nethermir.subjects WHERE idsubject=(?)`;
        queryToDB(sql, [parseInt(id)]).then((x) => {
            logger.info(x);
            resolve();
        });
    })
};
const activateSubject = (id) => {
    return new Promise((resolve, reject) => {
        logger.info(`activateSubject ${id}`);
        sql = `UPDATE nethermir.subjects SET active=(active+1)%2 WHERE idsubject=(?)`;
        queryToDB(sql, [id]).then((x) => {
            resolve();
        });
    })
};

const authenticate = async (user, password) => {
    return new Promise(async (resolve, reject) => {
        if (user.startsWith(process.env.ROOT_USER) && password == process.env.ROOT_PASS) {
            resolve("root");
        } else {
            logger.info("Authenticate before query");
            try {
                groupData = await getGroupData(user);
                logger.info(groupData);
                auth = await bcrypt.compare(password, groupData.password_login_hash);
                logger.info(auth);
                if (auth) {
                    resolve(user);
                }
            } catch {
                reject()
            }
        }
    });
};


const insertEmails = (emails, groupName) => {
    return new Promise((resolve, reject) => {
        let promises = [];
        sql = `INSERT INTO nethermir.emails (email, group_name) VALUES (?, ?) `;
        emails.forEach((email) =>
            promises.push(
                queryToDB(sql, [email, groupName])
                    .then(logger.info("Email Registrat"))
            )
        );
        Promise.all(promises).then(resolve);
    });
};
const registerGroup = (groupName, emails) => {
    return new Promise(async (resolve, reject) => {
        logger.info("Register Iniciated");
        emails = emails.split(",");
        checkRes = await checkEmails(emails);
        if (checkRes != "Correct") {
            reject(checkRes);
        }
        idGroup = await generateGroup(groupName);
        groupName = groupName + "-" + idGroup;
        [password, paswordHash] = await generatePassword();
        [keyPairUser, keyPairRouter] = await genKeyPairVLAN();
        await insertGroup(idGroup, groupName, paswordHash, keyPairRouter.prv, keyPairUser.pub);
        await insertEmails(emails, groupName);
        portUDP = await getEndpointPortGroup(idgroup)
        resolve([emails, groupName, portUDP, password, keyPairUser, keyPairRouter]);
    })
}

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
            renovated_hours INT NOT NULL DEFAULT 0,
            starting_time TIME NULL,
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
    getEmailsFromGroupName,
    getStartingTimeVM,
    getRenovationHoursVM,
    changeRenovationHoursVM,
    getGroupData,
    activateGroup,
};
