import NaiveBayes from '../modules/naive-bayes';

import { logger } from '../utils/logger';

/**
 * @class NaiveBayesApi
 * @extends NaiveBayes
 * @description test
 */
export class NaiveBayesApi extends NaiveBayes {

    /**
     * @constructor description
     */
    constructor() {
        super();
    }

    /**
     * @method apiCall
     * @description description
     * @param {string} endpoint description
     * @param {object} req description
     * @return {Promise} promise
     */
    public apiCall(endpoint: string, req: any) {
        switch (endpoint) {
            case 'learn':
                return new Promise((resolve, reject) => {
                    if (req.text && req.category) {
                        const learn = this.learn(req.text, req.category);

                        resolve({
                            code: 'succes',
                            message: learn
                        });
                        logger.info(`apiCall :: category = ${req.category} learn = ${JSON.stringify(learn)}`);
                    } else {
                        reject({
                            code: 'error',
                            message: 'Post parameters not set'
                        });
                        logger.error(`apiCall :: '${endpoint}' post parameters 'text' or 'category' is not set`);
                    }
                });
            case 'predict':
                return new Promise((resolve, reject) => {
                    if (req.text) {
                        const predict = this.predict(req.text);

                        resolve({
                            code: 'succes',
                            message: predict
                        });
                        logger.info(`predict: ${predict}`);
                    } else {
                        reject({
                            code: 'error',
                            message: 'Post parameters not set'
                        });
                        logger.error(`apiCall :: '${endpoint}' post parameter 'text' is not set`);
                    }
                });
            case 'import':
                return new Promise((resolve, reject) => {
                    if (req.jsonString) {
                        const importDataJson = this.importData(req.jsonString);

                        resolve({
                            code: 'succes',
                            message: importDataJson
                        });
                        logger.info(`apiCall :: importData :: ${importDataJson}`);
                    } else {
                        reject({
                            code: 'error',
                            message: 'Post parameters not set'
                        });
                        logger.error(`apiCall :: '${endpoint}' post parameter 'jsonString' is not set`);
                    }
                });
            break;
            case 'export':
                return new Promise((resolve, reject) => {
                    const exportDataJson = this.exportData();

                    if (!exportDataJson.error) {
                        resolve({
                            code: 'succes',
                            message: exportDataJson
                        });
                        logger.info(`apiCall :: exportData :: ${exportDataJson}`);
                    } else {
                        reject({
                            code: 'error',
                            message: exportDataJson.error
                        });
                        logger.error(`apiCall :: ${endpoint}: ${exportDataJson.error}`);
                    }
                });
            default:
                return new Promise((reject) => {
                    reject({
                        code: 'error',
                        message: `Endpoint '${endpoint}' does not exist`
                    });
                    logger.error(`apiCall :: '${endpoint}' does not exist`);
                });
        }
    }
}