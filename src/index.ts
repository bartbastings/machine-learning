'use strict';

console.log('Start Rest API');

import { config } from './app/utils/config';

import App from './app/app';
import NaiveBayes from './app/modules/naive-bayes';

/**
 * @constant {App} app todo
 */
const app = new App(config.port);

/**
 * @constant {NaiveBayes} naiveBayes todo
 */
const naiveBayes = new NaiveBayes();

let learn = naiveBayes.learn('terrible, shitty thing. Damn. Sucks!!', 'negative');

console.log(learn);

learn = naiveBayes.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive');

console.log(learn);

learn = naiveBayes.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'positive');

console.log(learn);

let predict = naiveBayes.predict('awesome, cool, amazing!! Yay.');

console.log(predict);

predict = naiveBayes.predict('awesome, incredibly, amazing!! great.');

console.log(predict);

predict = naiveBayes.predict('shit, fuck, damn!! not good.');

console.log(predict);

// console.log(naiveBayes.exportData());

/**
 * @function addPostEndPoint learn
 * @description Teach your classifier what category the text belongs to.
 * @param {string} text use the body parameter key:text value:string
 * @param {string} category use the body parameter key:category value:string
 * @returns NaiveBayes {
 *  vocabulary:
 *      {
 *          token: boolean,
 *          ...
 *      },
 *  vocabularySize: number,
 *  totalDocuments: number,
 *  docCount: [
 *      category: number,
 *      ...
 *  ],
 *  wordCount: [
 *      category: number,
 *      ...
 *  ],
 *  wordFrequencyCount: [
 *      category: {
 *          token: number,
 *          ...
 *      },
 *      ...
 *  ],
 *  categories: {
 *      category: boolean,
 *      ...
 *  },
 *  predictedCategory: string
 *  tokens: [
 *      token,
 *      ...
 *  ]
 */
app.addPostEndPoint('learn', naiveBayes);

/**
 * @function addPostEndPoint predict
 * @description todo
 * @param {string} text use the body parameter key:user value:string
 * @return
 */
app.addPostEndPoint('predict', naiveBayes);

/**
 * @function addPostEndPoint import
 * @description description
 * @param {string} user use the body parameter key:user value:string
 * @return
 */
app.addPostEndPoint('import', naiveBayes);

/**
 * @function addPostEndPoint export
 * @description description
 * @return
 */
app.addPostEndPoint('export', naiveBayes);

/**
 * @function listen
 */
app.listen();