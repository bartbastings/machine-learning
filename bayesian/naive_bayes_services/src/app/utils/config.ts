import * as dotenv from 'dotenv';

dotenv.config();

export const config = {

    /**
     * @property {string|number} port
     */
    port: process.env.PORT || 3000,

    /**
     * @property {string} port
     */
    logFile: process.env.LOG_FILE || './log/debug.log',

    /**
     * @property {string} errorLogFile
     */
    errorLogFile: process.env.ERROR_LOG_FILE || './log/error.log',

    /**
     * @property {string} errorLogFile
     */
    nodeEnv: process.env.NODE_ENV || 'development',
};
