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
        const digit = ExtendedMath.intDivMod(value, digitBase, base);
        return digit.toString(base);
    }

    static intDivMod(value, digitBase, base) {
        return Math.floor(value / digitBase) % base;
    }

    static getBaseLog(base, value) {
        return Math.log(value) / Math.log(base);
    }
}