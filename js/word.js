import ExtendedMath from "./extended_math.js";

export default class Word {
    bitSize;

    value;

    name;

    /**
     * Creates a binary word of a specific size.
     * @param {number} bitSize size in bits of the Word
     * @param {number} value will be converted to an insigned integer of the specified size
     * @param {string} name of the word, has no use other than labling
     */
    constructor(bitSize = 0, value = 0, name = '') {
        this.bitSize = bitSize;
        this.value = value;
        this.name = name;
        this.format();
    }

    /**
     * Formats this Word's value to an unsigned integer of the Word's size
     * @param {number=} value optional value to encode and set as the new value
     */
    format(value) {
        this.value = ExtendedMath.toWord(Math.abs(value ?? this.value), this.bitSize);
    }

    /**
     * Appends an array of words into a new word, applying the neccessary offsets for each.
     * @param {...Word} words the words to be appended to each other
     * @returns {Word}
     */
    static mergeWords(...words) {
        return words.reduce(Word.mergeWord, new Word());
    }

    /**
     * Appends word to mergedWord
     * @param {Word} mergedWord 
     * @param {Word} word 
     * @returns 
     */
    static mergeWord(mergedWord, word) {
        word.format();
        mergedWord.value |= word.value << mergedWord.bitSize;
        mergedWord.bitSize += word.bitSize;
        return mergedWord;
    }

    /**
     * Deprecated, use Word.mergeWords instead
     * Appends an array of words into a new word, applying the neccessary offsets for each.
     * @param {Word[]} words 
     * @returns {number}
     */
    static combineOutput(words) {
        return Word.mergeWords(...words).value;
        // let bitOffset = 0;
        // return words.reduce((previous, word) => {
        //     const value = previous | (word.value & ExtendedMath.createBitmask(word.bitSize)) << bitOffset;
        //     bitOffset += word.bitSize;
        //     return value;
        // }, 0);
    }
}