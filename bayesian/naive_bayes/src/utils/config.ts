import * as dotenv from 'dotenv';

dotenv.config();

export const config = {

    /**
     * @property {string} port
     */
    logFile: process.env.LOG_FILE || 'debug.log',

    /**
     * @property {string} errorLogFile
     */
    errorLogFile: process.env.ERROR_LOG_FILE || 'error.log',

};
