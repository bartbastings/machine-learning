/**
 * @interface IVocabulary
 */
export interface IVocabulary {
    [key: string]: boolean;
}

/**
 * @interface IDocCount
 */
export interface IDocCount {
    [key: string]: number;
}

/**
 * @interface IWordCount
 */
export interface IWordCount {
    [key: string]: number;
}

/**
 * @interface IWordFrequencyCountToken
 */
export interface IWordFrequencyCountToken {
    [key: string]: number;
}

/**
 * @interface IWordFrequencyCount
 */
export interface IWordFrequencyCount {
    [key: string]: IWordFrequencyCountToken;
}

/**
 * @interface ICategories
 */
export interface ICategories {
    [key: string]: boolean;
}

/**
 * @interface NaiveBayes
 */
export interface INaiveBayesClass {
    vocabulary: IVocabulary;
    vocabularySize: number;
    totalDocuments: number;
    docCount: IDocCount;
    wordCount: IWordCount;
    wordFrequencyCount: IWordFrequencyCount;
    categories: ICategories;
}

/**
 * @interface IFrequencyTable
 */
export interface IFrequencyTable {
    [key: string]: number;
}

/**
 * @interface IProbability
 */
export interface IProbability {
    [key: string]: number;
}

/**
 * @interface Predict
 */
export interface IPredict {
    probabilities: IProbability;
    predicted: string;
}
