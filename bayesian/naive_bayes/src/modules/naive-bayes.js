const _ = require('lodash');

const { logger } = require('../utils/logger');
const { CONSTANTS } = require('../constants/constants');

/**
 * @class NaiveBayes
 * @description Naive Bayes classifier
 * Theory: P(A|B) = P(A|B) + P(A) / P(B)
 */
module.exports = class NaiveBayes {
    /**
     * @constructor NaiveBayes class
     * @description set all the properties in the class
     */
    constructor() {
        /**
         * @property {object} vocabulary Initialize of the vocabulary
         */
        this.vocabulary = {};

        /**
         * @property {number} vocabularySize Size of the vocabulary
         */
        this.vocabularySize = 0;

        /**
         * @property {number} totalDocuments number of documents we have learned from
         */
        this.totalDocuments = 0;

        /**
         * @property {array} docCount for or each category, how often were documents mapped to it
         */
        this.docCount = {};

        /**
         * @property {array} wordCount for each category, how many words total were mapped to it
         */
        this.wordCount = {};

        /**
         * @property {number} wordFrequencyCount for each category,
         * how frequent was a given word mapped to it
         */
        this.wordFrequencyCount = {};

        /**
         * @property {object} classes - hashmap of all the class names
         */
        this.classNames = {};

        /**
         * @property {number} classCount - count for each className
         */
        this.classCount = 0;

        /**
         * @property {regular expression} rgxReplace - TODO
         */
        this.rgxReplace = /[^(a-zA-Z0-9)+\s]/g;

        /**
         * @property {regular expression} rgxSplit - TODO
         */
        this.rgxSplit = /\s+/;
    }

    /**
     * @method initClass
     * @description Initialize each of our data structure entries for this new class.
     * @param {string} className
     */
    initClass(className) {
        if (!this.classNames[className]) {
            this.docCount[className] = 0;
            this.wordCount[className] = 0;
            this.wordFrequencyCount[className] = {};
            this.classNames[className] = true;
            this.classCount += 1;

            logger.info(`initClass :: className : the new className '${className}' added`);
        } else {
            logger.info(`initClass :: className : the className '${className}' already exist`);
        }
    }

    /**
     * @method initVocabulary
     * @description add this word to our vocabulary if not already existing
     * @param {string} token - token
     */
    initVocabulary(token) {
        if (!this.vocabulary[token]) {
            this.vocabulary[token] = true;
            this.vocabularySize += 1;

            logger.info('TODO');
        } else {
            logger.info('TODO');
        }
    }

    /**
     * @method initWordFrequencyCount
     * @description update the frequency information for this word in this category
     * @param frequencyInText frequencyInText
     * @param token token
     * @param category the category name
     */
    itWordFrequencyCount(frequencyInText, token, category) {
        if (!this.wordFrequencyCount[category][token]) {
            this.wordFrequencyCount[category][token] = frequencyInText;

            logger.info('TODO');
        } else {
            this.wordFrequencyCount[category][token] += frequencyInText;

            logger.info('TODO');
        }
    }

    /**
     * @method tokenizer
     * @description Given an input string, tokenize it into an array of word tokens.
     * @param {string} text
     * @returns array of word tokens
     */
    tokenizer(text) {
        const textReplaced = text.replace(this.rgxReplace, ' ');
        return textReplaced.toLowerCase().trim().split(this.rgxSplit);
    }

    /**
     * @method tokenProbability
     * @description Calculate probability that a `token` belongs to a `category`
     * @param {string} token
     * @param {string} category
     * @return {number} probability
     */
    tokenProbability(token, className) {
        // how many times this word has occurred in documents mapped to this category
        const wordFrequencyCount = this.wordFrequencyCount[className][token] || 0;

        // what is the count of all words that have ever been mapped to this category
        const wordCount = this.wordCount[className];

        // use laplace Add-1 Smoothing equation
        return (wordFrequencyCount + 1) / (wordCount + this.vocabularySize);
    }

    /**
     * @method frequencyTable
     * @description Build a frequency hashmap where:
     * - the keys are the entries in `tokens`
     * - the values are the frequency of each entry in `tokens`
     * @param {array} tokens - Normalized word array
     * @return {object} frequencyTable
     */
    frequencyTable(tokens) {
        this.frequencyTable = Object.create(null);

        _.forEach(tokens, (token) => {
            if (!this.frequencyTable[token]) {
                this.frequencyTable[token] = 1;
            } else {
                this.frequencyTable[token] += 1;
            }
        });
        return this.frequencyTable;
    }

    /**
     * @method _iterateKeys
     * @param {object} objectKeys
     * @param {function} callBack
     */
    iterateKeys(objectKeys, callBack) {
        this.namesArray = _.keys(objectKeys);
        _.forEach(this.namesArray, callBack);
    }

    /**
     * @method learn
     * @description train our naive-bayes classifier,
     * by telling it what `classNAME` the `text` corresponds to.
     * @param {string} text - text to train corresponding to the category
     * @param {string} className - className to train corresponding to the text
     */
    lear(text, className) {
        if (typeof text !== 'string' && typeof className !== 'string') {
            logger.error('lear :: error : one of the parameters is not a string');
            throw new Error('Only string parameter supported!');
        }
        // initialize class data structures if we've never seen this className
        this.initClass(className);

        // update our count of how many documents mapped to this class
        this.docCount[className] += 1;

        // update the total number of documents we have learned from
        this.totalDocuments += 1;

        // normalize the text into a word array
        const tokens = this.tokenizer(text);

        // get a frequency count for each token in the text
        const frequencyTable = this.frequencyTable(tokens);

        // update our vocabulary and our word frequency
        this.iterateKeys(frequencyTable, (token) => {
            // add this word to our vocabulary if not already existing
            this.initVocabulary(token);

            const frequencyInText = frequencyTable[token];

            // update the frequency information for this word in this className
            this.initWordFrequencyCount(frequencyInText, token, className);

            // update the count of all words we have seen mapped to this className
            this.wordCount[className] += frequencyInText;
        });

        return this;
    }

    /**
     * @method classify
     * @description Classify what className the text belongs to.
     * @param {string} text - text to predict corresponding to a category
     * @return {string} chosenCategory
     */
    classify(text) {
        if (typeof text !== 'string') {
            logger.error('classify :: error : the parameter \'text\' is not a string');
            throw new Error('Only string parameter supported!');
        }
        // set the max probability negative infinity
        let maxProbability = -Infinity;

        // the return object
        const returnPredict = {};

        // normalize the text into a word array
        const tokens = this.tokenizer(text);

        // get a frequency count for each token in the text
        const frequencyTable = this.frequencyTable(tokens);

        // iterate thru our categories to find the one with max probability for this text
        this.iterateKeys(this.classNames, (className) => {
            // let maxClassProbability = -Infinity;

            // start by calculating the overall probability of this category
            const classProbability = this.docCount[className] / this.totalDocuments;

            // take the log to avoid underflow
            let logProbability = Math.log(classProbability);

            // now determine P(A|B) for each word `b` in the text
            this.iterateKeys(frequencyTable, (token) => {
                const frequencyInText = frequencyTable[token];
                const tokenProbability = this.tokenProbability(token, className);

                // determine the log of the P(A|B) for this word
                logProbability += frequencyInText * Math.log(tokenProbability);
            });

            if (logProbability > maxProbability) {
                maxProbability = logProbability;
                returnPredict.predicted = className;
            }
        });

        return returnPredict;
    }

    /**
     * @method importData
     * @description Initializes a NaiveBayes instance from a JSON state representation
     * @param {string} jsonStr
     * @returns {object}
     */
    importData(jsonStr) {
        let parsed = {};

        try {
            parsed = JSON.parse(jsonStr);
        } catch (error) {
            logger.error(`importData :: error : not a valid JSON string ${jsonStr}`);
        }

        _.forEach(CONSTANTS.STATE_KEYS, (key) => {
            if (parsed[key]) {
                this[key] = parsed[key];
            } else {
                logger.error(`importData :: error : missing an expected property ${key}`);
            }
        });

        return this;
    }

    /**
     * @method exportData
     * @description description
     * @return {string} json
     */
    exportData() {
        const state = {};

        if (this.vocabularySize > 0) {
            _.forEach(CONSTANTS.STATE_KEYS, (key) => {
                state[key] = this[key];
            });
        } else {
            logger.error('exportData :: error : no data available');
        }

        return state;
    }
};
