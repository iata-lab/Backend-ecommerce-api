const { createLogger, format, transports } = require('winston');
const path = require('path');
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});


const devLogger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()]
});

const prodLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error',
      maxsize: 5242880, 
      maxFiles: 5
    }),
    new transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});


module.exports = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;