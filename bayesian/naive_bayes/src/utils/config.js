exports.config = {

    /**
     * @property {string} logFile
     */
    logFile: process.env.LOG_FILE || './log/debug.log',

    /**
     * @property {string} errorLogFile
     */
    errorLogFile: process.env.ERROR_LOG_FILE || './log/error.log',
};
