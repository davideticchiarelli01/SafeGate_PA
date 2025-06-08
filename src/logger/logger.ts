import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Resolve the path to the log directory
const logDir = path.resolve(process.cwd(), 'src/logger/logs');

// Create the directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log(`Log directory created at: ${logDir}`);
} else {
    console.log(`Log directory already exists at: ${logDir}`);
}

/**
 * Custom log levels.
 */
const levels = {
    error: 0, // Critical errors
    warn: 1,  // Warnings
    info: 2,  // General information
    http: 3,  // HTTP requests
    debug: 4, // Debugging messages
};

/**
 * Custom color mappings for each log level when printing to the console.
 */
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Register custom colors to winston
winston.addColors(colors);

/**
 * File output format: timestamp + log level + message
 */
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

/**
 * Console output format: colored + timestamp + log level + message
 */
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

/**
 * Transport definitions:
 * - Console: colored, for development
 * - error.log: logs only error-level messages
 * - all.log: logs all-level messages
 */
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

/**
 * Winston Logger instance with defined levels and transports.
 * This logger can be imported and used throughout the application.
 */
const Logger = winston.createLogger({
    levels,
    transports,
});

export default Logger;
