'use strict';

import NaiveBayes from './modules/naive-bayes';
import { logger } from './utils/logger';

logger.info('Start Naive Bayes classifier');

/**
 * @constant {NaiveBayes} naiveBayes todo
 */
const naiveBayes = new NaiveBayes();

naiveBayes.learn('terrible, shitty thing. Damn. Sucks!!', 'negative');
naiveBayes.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive');
naiveBayes.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'positive');

logger.info(JSON.stringify(naiveBayes.predict('awesome, cool, amazing!! Yay.')));
