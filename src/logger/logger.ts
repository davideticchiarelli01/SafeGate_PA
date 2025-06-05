import winston from 'winston'
import path from 'path'

const logDir = path.resolve(process.cwd(), 'src/logger/logs');

console.log(`Log directory created at: ${logDir}`)

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

/*const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'    DA VEDERE    
    return isDevelopment ? 'debug' : 'warn'
}}*/

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
)


const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

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

const Logger = winston.createLogger({
    //level: level(),
    levels,
    transports,
})

export default Logger