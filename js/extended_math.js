import Word from "./word.js";

export default class ExtendedMath {
    /**
     * like map but with a fixed count instead of an input array and it allows additional parameters to be passed on to the callback function
     * @param {*} loopCount 
     * @param {*} callback 
     * @param  {...any} callbackParameters 
     * @returns 
     */
    static sample(loopCount, callback, ...callbackParameters) {
        const data = [];
        for (let index = 0; index < loopCount; index++) {
            data.push(callback(index, ...callbackParameters));
        }
        return data;
    }

    static getHexDigit(value, index) {
        return this.getDigit(value, index, 16);
    }

    static getDigit(value, index, base) {
        const digitBase = base ** index;
        const digit = ExtendedMath.intDivMod(value, digitBase, base);
        return digit.toString(base);
    }

    static intDivMod(value, digitBase, base) {
        return Math.floor(value / digitBase) % base;
    }

    /**
     * 
     * @param {number} value 
     * @param {number} offset in bits
     * @param {number} length in bits
     * @returns 
     */
    static bitSelect(value, offset, length) {
        return ExtendedMath.toWord(value >> offset, length);
    }

    /**
     * 
     * @param {number} value 
     * @param {number} offset in bits
     * @param {number} length in bits
     * @returns 
     */
    static bitSelectKeepOffset(value, offset, length) {
        return ExtendedMath.bitSelect(value, offset, length) << offset;
    }

    /**
     * 
     * @param {number} value 
     * @param {number} length in bits
     * @returns 
     */
    static toWord(value, length) {
        return Math.floor(value) & ExtendedMath.createBitmask(length);
    }

    /**
     * a bitmask of the specified length
     * @param {number} length in bits
     * @returns {number} a bitmask
     */
    static createBitmask(length) {
        return (1 << length) - 1;
    }

    /**
     * 
     * @param {number} input 
     * @param  {number[]} subWordSizes 
     * @returns {number[]} 
     */
    static wordSplit(input, subWordSizes){
        let bitOffset = 0;
        return subWordSizes.map(subWordSize => {
            const value = ExtendedMath.bitSelect(input, bitOffset, subWordSize);
            bitOffset += subWordSize;
            return value;
        });
    }

    /**
     * 
     * @param {Word[]} words 
     * @returns 
     */
    static combineOutput(words) {
        let bitOffset = 0;
        return words.reduce((previous, word) => {
            const value = previous | (word.value & ExtendedMath.createBitmask(word.bitSize)) << bitOffset;
            bitOffset += word.bitSize;
            return value;
        }, 0);
    }

    static getBaseLog(base, value) {
        return Math.log(value) / Math.log(base);
    }

    /**
     *
     * @param {number[][]} array
     * @param {(item: number, x: number, y: number, array: number[][]) => void} callback
     */
    static forEach2D(array, callback) {
        for (const y in array) {
            const row = array[y];
            for (const x in row) {
                const element = row[x];
                callback(element, parseInt(x), parseInt(y), array);
            }
        }
    }

    /**
     *
     * @param {any[][]} array
     * @param {(accumulator: any, currentValue: any, x: number, y: number, array: any[][]) => any} callback
     * @param {any} initialValue
     * @returns {any}
     */
    static reduce2D(array, callback, initialValue = 0) {
        let accumulator = initialValue;
        for (const y in array) {
            const row = array[y];
            for (const x in row) {
                const element = row[x];
                accumulator = callback(accumulator, element, parseInt(x), parseInt(y), array);
            }
        }
        return accumulator;
    }
 
    /**
     * 
     * @param {string} string 
     * @returns {string[]}
     */
    static stringToArray(string) {
        return string.replace(/ |\[|\]/g, '').split(',')
            .map(element => element.toString());
    }

    /**
     * 
     * @param {string} string 
     * @param {RegExp} regex 
     * @returns {string | null}
     */
    static matchFirst(string, regex){
        const match = string.match(regex);
        if(match === null) return null;
        return match[0];
    }

    /**
     * 
     * @param {string} string 
     * @param {RegExp} regex 
     * @returns {number|null}
     */
    static matchFirstAsInt(string, regex){
        const match = ExtendedMath.matchFirst(string, regex);
        if(match === null) return null;
        return parseInt(match);
    }

    /**
     * 
     * @param {string} string 
     * @param {RegExp} regex 
     * @returns {boolean}
     */
    static hasMatch(string, regex){
        return ExtendedMath.matchFirst(string, regex) !== null;
    }

    /**
     * use arr1.flat() instead
     * @param {any[]} data 
     */
    // static flattenArray(data) {
    //     if (!Array.isArray(data)) {
    //         return data;
    //     }
    //     return data.map(ExtendedMath.flattenArray);
    // }
}