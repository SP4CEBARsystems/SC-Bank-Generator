import ExtendedMath from "./extended_math.js";

export default class MemoryBankGenerator {
    numberOfLocations;
    
    constructor(numberOfLocations) {
        this.numberOfLocations = numberOfLocations;
    }

    /**
     * 
     * @param {(bankIndex, bankPosition) => number} callback 
     * @returns
     */
    generate(callback){
        const bankArrayData = [];
        for (let bankPosition = 0; bankPosition < this.numberOfLocations; bankPosition++) {
            bankArrayData.push(this.generateOne(callback, bankPosition));
        }
        return bankArrayData;
    }

    generateOne(callback, bankPosition) {
        const bankData = ExtendedMath.sample(256, callback, bankPosition);
        const bankDataStrings = new Array(this.countMemoryBanksRequired(bankData));
        for (const value of bankData) {
            bankDataStrings.forEach((element, index) => 
                element.concat(ExtendedMath.getHexDigit(value, index))
            );
        }
    }

    countMemoryBanksRequired(bankData) {
        const biggestValue = Math.max(...bankData);
        return Math.ceil(ExtendedMath.getBaseLog(16, biggestValue + 1));
    }
}
