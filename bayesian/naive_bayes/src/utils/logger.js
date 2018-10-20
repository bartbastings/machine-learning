const { createLogger, format, transports } = require('winston');
const { config } = require('./config');

const winstonLogger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    level: 'info',
    transports: [
        new transports.File({
            filename: config.errorLogFile,
            level: 'error',
        }),
        new transports.File({
            filename: config.logFile,
            maxsize: 4096,
        }),
    ],
});

if (config.nodeEnv !== 'production') {
    winstonLogger.add(new transports.Console({
        format: format.simple(),
    }));
}

exports.logger = winstonLogger;
