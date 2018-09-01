import { createLogger, format, transports } from 'winston';

import { config } from './config';

/**
 * @constant {object} winstonLogger Create own logger
 */
const winstonLogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({
            filename: config.errorLogFile,
            level: 'error'
        }),
        new transports.File({
            filename: config.logFile,
            maxsize: 4096,
        })
    ],
});

if (config.nodeEnv !== 'production') {
    winstonLogger.add(new transports.Console({
        format: format.simple(),
    }));
}

export const logger = winstonLogger;