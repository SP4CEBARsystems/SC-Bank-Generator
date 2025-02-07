import ExtendedMath from "./extended_math.js";

export default class MemoryBankGenerator {
    numberOfLocations;

    /**
     * @type {string[][]}
     */
    generatedData = [];
    
    /**
     * 
     * @param {number} numberOfLocations 
     */
    constructor(numberOfLocations) {
        this.numberOfLocations = numberOfLocations;
    }

    /**
     * 
     * @param {(bankIndex, previousOutput, bankPosition) => number} callback 
     */
    generate(callback){
        const bankArrayData = [];
        for (let bankPosition = 0; bankPosition < this.numberOfLocations; bankPosition++) {
            bankArrayData.push(this.generateOne(callback, bankPosition));
        }
        this.generatedData = bankArrayData;
    }

    /**
     * 
     * @param {(bankIndex, previousOutput, bankPosition) => number} callback 
     * @param {number} bankPosition 
     * @returns {string[]}
     */
    generateOne(callback, bankPosition) {
        const bankData = ExtendedMath.sample(256, callback, bankPosition);
        const arrayLength = this.countMemoryBanksRequired(bankData);
        // console.log(arrayLength, bankData);
        const bankDataStrings = new Array(arrayLength).fill("");
        for (const bankValue of bankData) {
            for (const digitIndex in bankDataStrings) {
                bankDataStrings[digitIndex] += ExtendedMath.getHexDigit(bankValue, digitIndex);
            }
        }
        return bankDataStrings
    }

    /**
     * 
     * @param {number[]} bankData 
     * @returns 
     */
    countMemoryBanksRequired(bankData) {
        const biggestValue = Math.max(...bankData);
        return Math.ceil(ExtendedMath.getBaseLog(16, biggestValue + 1));
    }

    /**
     * 
     * @returns {string[][]}
     */
    getFormattedData(){
        return this.generatedData
            .map(element => element
                .map(element => insertNewlines(element)));

        /**
         * generated by ChatGPT
         * @param {string} str 
         * @param {number} interval 
         * @returns 
         */
        function insertNewlines(str, interval = 16) {
            return str.replace(new RegExp(`(.{${interval}})`, 'g'), '$1\n');//
        }
    }

    /**
     * 
     * @param {HTMLParagraphElement} element 
     */
    write(element) {
        element.innerHTML = this.getFormattedData()[0].reduce(
            (previous, element) => previous.concat(element.replace(/\n/g, '<br>')),
            ''
        );
        // element.textContent
    }
}
