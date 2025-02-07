export default class ExtendedMath {
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
        const digit = Math.floor(value / digitBase) % base;
        return digit.toString(base);
    }

    static getBaseLog(base, value) {
        return Math.log(value) / Math.log(base);
    }
}