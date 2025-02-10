import ExtendedMath from "./extended_math.js";

export default class TypeValue {
    type;

    value;

    /**
     * 
     * @param {string} type 
     * @param {number} value 
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    /**
     * 
     * @param {string} type 
     * @param {number} inputvalue 
     */
    static inputValue(type, inputvalue) {
        return new TypeValue(type, TypeValue.encode(type, inputvalue));
    }
    
    /**
     * 
     * @param {string} type 
     * @param {number} inputvalue 
     */
    static encode (type, inputvalue) {
        const size = TypeValue.sizeOf(type);
        switch (type) {
            case 'int':
                //uses 2s complement
                const signValue = 1 << (size - 1);
                const isNegative = inputvalue < 0;
                const sign = isNegative ? signValue : 0;
                const value = ExtendedMath.toWord(Math.abs(inputvalue), size-1);
                if (isNegative) {
                    return signValue * 2 - value;
                } else {
                    return value;
                }
            case 'u_int':
                return ExtendedMath.toWord(Math.abs(inputvalue), size);
            default:
                return inputvalue;
        }
    }
    /**
     * 
     * @returns {number}
     */
    outputValue() {
        const size = TypeValue.sizeOf(this.type);
        switch (this.type) {
            case 'int':
                //uses 2s complement
                const value = ExtendedMath.bitSelect(this.value, 0, size-1);
                const sign = -ExtendedMath.bitSelectKeepOffset(this.value, size-1, 1);
                return value + sign;
            case 'u_int':
                return ExtendedMath.bitSelect(this.value, 0, size);
            default:
                return this.value;
        }
    }

    /**
     * 
     * @param {string[]} types 
     * @param {number[]} values 
     * @returns {TypeValue[]}
     */
    static arrayFromPreFormatted(types, values) {
        if (types.length !== values.length) {
            return [];
        }
        return types.map((type, index) => new TypeValue(type, values[index]));
    }

    /**
     * 
     * @param {string[]} types 
     * @param {number[]} values 
     * @returns {TypeValue[]}
     */
    static arrayFromValues(types, values) {
        if (types.length !== values.length) {
            return [];
        }
        return types.map((type, index) => new TypeValue(type, values[index]));
    }

    /**
     * Gets the size of datatypes
     * @param {string} dataType 
     * @returns {number} the size
     */
    static sizeOf(dataType) {
        switch (dataType) {
            case '':
            case undefined:
            case null:
                return 0;
        }
        const parts = dataType.toString().toLowerCase().split(/(\d+)$/);
        if (parts.length < 1) {
            return 0;
        } else if (parts.length >= 2) {
            return parseInt(parts[1]);
        }
        switch (parts[0]) {
            case 'bit':
            case 'flag':
            case 'bool':
            case 'boolean':
                return 1;
            case 'nibble':
                return 4;
            case 'byte':
                return 8;
            case 'int':
                return 8;
                // return 16;
            case 'u_int':
                return 16;
            case 'float':
                return 32;
            case 'double':
                return 64;
            default:
                return 0;
        }
    }
}