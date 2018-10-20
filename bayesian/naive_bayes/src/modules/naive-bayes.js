const _ = require('lodash');

// const { CONSTANTS } = require('../constants/constants');

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
         * @property {object} categories hashmap of our category names
         */
        this.categories = {};

        /**
         * @property {object} categories hashmap of our category names
         */
        this.categoryCount = 0;
    }

    /**
     * @method initCategory
     * @description Initialize each of our data structure entries for this new category.
     * @param {string} category
     */
    initCategory(category) {
        if (!this.categories[category]) {
            this.docCount[category] = 0;
            this.wordCount[category] = 0;
            this.wordFrequencyCount[category] = {};
            this.categories[category] = true;
            this.categoryCount += 1;
        }
    }

    /**
     * @method initVocabulary
     * @description add this word to our vocabulary if not already existing
     * @param {string} token token
     */
    initVocabulary(token) {
        if (!this.vocabulary[token]) {
            this.vocabulary[token] = true;
            this.vocabularySize += 1;
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
        } else {
            this.wordFrequencyCount[category][token] += frequencyInText;
        }
    }

    /**
     * @method tokenizer
     * @description Given an input string, tokenize it into an array of word tokens.
     * @param {string} text
     * @returns array of word tokens
     */
    tokenizer(text) {
        this.rgxReplace = /[^(a-zA-Z0-9)+\s]/g;
        this.rgxSplit = /\s+/;

        const textReplaced = text.replace(this.rgxReplace, ' ');
        return textReplaced.toLowerCase().trim().split(this.rgxSplit);
    }

    /**
     * @method frequencyTable
     * @description Build a frequency hashmap where:
     * - the keys are the entries in `tokens`
     * - the values are the frequency of each entry in `tokens`
     * @param {array} tokens Normalized word array
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

    lear(text, category) {
        // initialize category data structures if we've never seen this category
        this.initCategory(category);

        // update our count of how many documents mapped to this category
        this.docCount[category] += 1;

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

            // update the frequency information for this word in this category
            this.initWordFrequencyCount(frequencyInText, token, category);

            // update the count of all words we have seen mapped to this category
            this.wordCount[category] += frequencyInText;
        });

        return this;
    }
};
