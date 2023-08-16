var winston = require('winston');

var logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      name: 'error-file',
      filename: `${process.env.LOGS_FILEPATH}/nethermir.err`,
      level: 'error',
      json: false,
    }),
    new winston.transports.File({
        name: 'error-file',
        filename: `${process.env.LOGS_FILEPATH}/nethermir.log`,
        json: false,
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${process.env.LOGS_FILEPATH}/nethermir_rotate.log`,
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      json: false,
      level: 'info',
    }),
  ],
  exitOnError: false,
});

module.exports = logger;

module.exports.stream = {
  write: function (message) {
    logger.info(message);
    console.log('message = ', message);
  },
};