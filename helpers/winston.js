const winston = require('winston');

// Transports
const transportDefinitions = {
   // Normal file logger
   infoFile: {
      level: 'http',
      filename: 'combined.log',
      dirname: './logs/',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
   },
   // Error logger
   errFile: {
      level: 'error',
      filename: 'error.log',
      dirname: './logs/',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
   },

   // Logging to console
   console: {
      level: 'info',
      handleExceptions: true,
      json: true,
      colorize: true,
   },
};

// timezone function winston calls to get timezone
const timezoned = () =>
   new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
   });

// logger object with above defined options
const logger = winston.createLogger({
   transports: [
      new winston.transports.File(transportDefinitions.infoFile),
      new winston.transports.File(transportDefinitions.errFile),
      new winston.transports.Console(transportDefinitions.console),
   ],
   format: winston.format.combine(
      winston.format.simple(),
      winston.format.timestamp({
         format: timezoned,
      }),
      winston.format.printf((logObject) => `[${logObject.timestamp}] ${logObject.level}: ${logObject.message.trim()}`)
   ),
   exitOnError: false,
});

logger.stream = {
   write(message) {
      logger.http(message);
   },
};

module.exports = logger;
