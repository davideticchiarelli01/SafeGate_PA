import winston from 'winston'

import fs from 'fs'
import path from 'path'

const logDir = path.resolve(process.cwd(), 'src/logger/logs'); // Define the path where the log files will be stored

console.log(`Log directory created at: ${logDir}`)

// Define your severity levels. 
// With them, You can create log files, 
// see or hide levels based on the running ENV.
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// This method set the current severity based on 
// the current NODE_ENV: show all the log levels 
// if the server was run in development mode; otherwise, 
// if it was run in production, show only warn and error messages.
const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

// Define different colors for each level. 
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

// Tell winston that you want to link the colors 
// defined above to the severity levels.
winston.addColors(colors)

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
)

// Chose the aspect of your log customizing the log format.
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }), // Tell Winston that the logs must be colored
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`, // Define the format of the message showing the timestamp, the level and the message
    ),
)

// Define which transports the logger must use to print out messages. 
// In this example, we are using three different transports 
const transports = [

    new winston.transports.Console({
        format: consoleFormat,
    }),

    new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: fileFormat,
    }),

    new winston.transports.File({
        filename: path.join(logDir, 'all.log'),
        format: fileFormat,
    }),
];

// Create the logger instance that has to be exported 
// and used to log messages.
const Logger = winston.createLogger({
    level: level(),
    levels,
    transports,
})

export default Logger