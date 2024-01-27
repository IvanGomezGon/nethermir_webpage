const path = require("path");
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

const restartDatabase = async () => {
    sql = `ALTER TABLE nethermir.emails
        ADD UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE;`;
    queryToDB(sql).then(logger.info).catch(logger.info)
};
restartDatabase()
