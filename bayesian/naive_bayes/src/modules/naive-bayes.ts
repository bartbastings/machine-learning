import * as _ from 'lodash';

import { CONSTANT } from '../constants/constant';
import { IFrequencyTable, INaiveBayesClass, IPredict } from '../interfaces/naive-bayes-interface';
import { logger } from '../utils/logger';

/**
 * @constant STATE_KEYS
 */
const STATE_KEYS = CONSTANT.STATE_KEYS;

/**
 * @class NaiveBayes
 * @description Naive Bayes Theory: P(A|B) = P(A|B) + P(A) / P(B)
 * - P = is the probability of a event is occurring
 * - P(A) is Probability of A = probability of event A is occurring 9/15
 * - P(B) is Probability of B = probability of event B is occurring 6/15
 * Probability A plus B need to be 100% so by the above example it's 15/15
 * - P(A|B) is “Probability of A given B”, the probability of A given that B happens
 * - P(B|A) is “Probability of B given A”, the probability of B given that A happens
 */
export default class NaiveBayes {

    /**
     * @property {object} vocabulary Initialize of the vocabulary
     */
    public vocabulary = {};

    /**
     * @property {number} vocabularySize Size of the vocabulary
     */
    public vocabularySize: number = 0;

    /**
     * @property {number} totalDocuments number of documents we have learned from
     */
    public totalDocuments: number = 0;

    /**
     * @property {array} docCount for or each category,
     * how often were documents mapped to it
     */
    public docCount = {};

    /**
     * @property {array} wordCount for each category,
     * how many words total were mapped to it
     */
    public wordCount = {};

    /**
     * @property {number} wordFrequencyCount for each category,
     * how frequent was a given word mapped to it
     */
    public wordFrequencyCount = {};

    /**
     * @property {object} categories hashmap of our category names
     */
    public categories = {};

    /**
     * @method learn
     * @description train our naive-bayes classifier,
     * by telling it what `category` the `text` corresponds to.
     * @param {String} text text to train corresponding to the category
     * @param {String} category category to train corresponding to the text
     */
    public learn(text: string, category: string): INaiveBayesClass {
        // initialize category data structures if we've never seen this category
        this._initCategory(category);

        // update our count of how many documents mapped to this category
        this.docCount[category]++;

        // update the total number of documents we have learned from
        this.totalDocuments++;

        // normalize the text into a word array
        const tokens = this._tokenizer(text);

        // get a frequency count for each token in the text
        const frequencyTable = this._frequencyTable(tokens);

        // update our vocabulary and our word frequency
        // count for this category console.log('_iterateKeys');
        this._iterateKeys(frequencyTable, (token) => {
            // add this word to our vocabulary if not already existing
            this._initVocabulary(token);

            const frequencyInText = frequencyTable[token];

            // update the frequency information for this word in this category
            this._initWordFrequencyCount(frequencyInText, token, category);

            // update the count of all words we have seen mapped to this category
            this.wordCount[category] += frequencyInText;
        });

        return this;
    }

    /**
     * @method predict
     * @description Predict what category `text` belongs to.
     * @param {string} text text to predict corresponding to a category
     * @return {string} chosenCategory
     */
    public predict(text: string): IPredict {
        let maxProbability = -Infinity;

        // the return object
        const returnPredict = {
            predicted: '',
            probabilities: {},
        };

        // normalize the text into a word array
        const tokens = this._tokenizer(text);

        // get a frequency count for each token in the text
        const frequencyTable = this._frequencyTable(tokens);

        // iterate thru our categories to find the one with max probability for this text
        this._iterateKeys(this.categories, (category) => {
            let maxCategoryProbability = -Infinity;
            // start by calculating the overall probability of this category
            const categoryProbability = this.docCount[category] / this.totalDocuments;

            // take the log to avoid underflow
            let logProbability = Math.log(categoryProbability);

            // now determine P(A|B) for each word `b` in the text
            this._iterateKeys(frequencyTable, (token) => {
                const frequencyInText = frequencyTable[token];
                const tokenProbability = this._tokenProbability(token, category);

                // determine the log of the P(A|B) for this word
                logProbability += frequencyInText * Math.log(tokenProbability);
            });

            if (logProbability > maxCategoryProbability) {
                maxCategoryProbability = logProbability;
                returnPredict.probabilities[category] = maxCategoryProbability;
            }

            if (logProbability > maxProbability) {
                maxProbability = logProbability;
                returnPredict.predicted = category;
            }
        });

        return returnPredict;
    }

    /**
     * @method importData
     * @description Initializes a NaiveBayes instance from a JSON state representation
     * @param {string} jsonStr
     * @returns {INaiveBayesClass}
     */
    public importData(jsonStr: string): INaiveBayesClass {
        let parsed = {};

        try {
            parsed = JSON.parse(jsonStr);
        } catch (error) {
            logger.error(`importData :: is not a valid JSON string ${jsonStr}`);
        }

        _.forEach(STATE_KEYS, (key) => {
            if (parsed[key]) {
                this[key] = parsed[key];
            } else {
                logger.error(`importData :: is missing an expected property ${key}`);
            }
        });

        return this;
    }

    /**
     * @method exportData
     * @description description
     * @return {string} json
     */
    public exportData(): any {
        const state = {};

        if (this.vocabularySize > 0) {
            _.forEach(STATE_KEYS, (key) => {
                state[key] = this[key];
            });
        } else {
            logger.error('exportData :: no data available');
        }

        return state;
    }

    /**
     * @method _initializeCategory
     * @description Initialize each of our data structure entries for this new category.
     * @param {string} category the category name
     */
    private _initCategory(category: string): void {
        if (!this.categories[category]) {
            this.docCount[category] = 0;
            this.wordCount[category] = 0;
            this.wordFrequencyCount[category] = {};
            this.categories[category] = true;
        }
    }

    /**
     * @method _tokenizer
     * @description Given an input string, tokenize it into an array of word tokens.
     * @param {string} text text to train corresponding to the category;
     */
    private _tokenizer(text: string): string[] {
        const rgxReplace = /[^(a-zA-Z0-9)+\s]/g;
        const rgxSplit = /\s+/;

        const textReplaced = text.replace(rgxReplace, ' ');
        const textSplit = textReplaced.toLowerCase().trim().split(rgxSplit);

        return textSplit;
    }

    /**
     * @method _frequencyTable
     * @description * Build a frequency hashmap where
     * - the keys are the entries in `tokens`
     * - the values are the frequency of each entry in `tokens`
     * @param {array} tokens Normalized word array
     * @return {object} frequencyTable
     */
    private _frequencyTable(tokens: string[]): IFrequencyTable {
        const frequencyTable = Object.create(null);

        _.forEach(tokens, (token) => {
            if (!frequencyTable[token]) {
                frequencyTable[token] = 1;
            } else {
                frequencyTable[token]++;
            }
        });

        return frequencyTable;
    }

    /**
     * @method _initVocabulary
     * @description add this word to our vocabulary if not already existing
     * @param {string} token token
     */
    private _initVocabulary(token: string): void {
        if (!this.vocabulary[token]) {
            this.vocabulary[token] = true;
            this.vocabularySize++;
        }
    }

    /**
     * @method _initWordFrequencyCount
     * @description update the frequency information for this word in this category
     * @param frequencyInText frequencyInText
     * @param token token
     * @param category the category name
     */
    private _initWordFrequencyCount(frequencyInText: number, token: string, category: string): void {
        if (!this.wordFrequencyCount[category][token]) {
            this.wordFrequencyCount[category][token] = frequencyInText;
        } else {
            this.wordFrequencyCount[category][token] += frequencyInText;
        }
    }

    /**
     * @method _iterateKeys
     * @param {object} objectKeys
     * @param {function} callBack
     */
    private _iterateKeys(objectKeys, callBack): void {
        const namesArray = _.keys(objectKeys);
        _.forEach(namesArray, callBack);
    }

    /**
     * @method _tokenProbability
     * @description Calculate probability that a `token` belongs to a `category`
     * @param {string} token
     * @param {string} category
     * @return {number} probability
     */
    private _tokenProbability(token: string, category: string): number {
        // how many times this word has occurred in documents mapped to this category
        const wordFrequencyCount = this.wordFrequencyCount[category][token] || 0;

        // what is the count of all words that have ever been mapped to this category
        const wordCount = this.wordCount[category];

        // use laplace Add-1 Smoothing equation
        return (wordFrequencyCount + 1) / (wordCount + this.vocabularySize);
    }
}
