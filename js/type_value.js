import DataType from "./data_type.js";
import ExtendedMath from "./extended_math.js";

export default class TypeValue {
    type;

    value;

    /**
     * 
     * @param {string} type 
     * @param {number} [value]
     * @param {boolean} isPassThrough
     */
    constructor(type, value, isPassThrough = false) {
        this.type = new DataType(type);
        if (value !== undefined) {
            this.value = isPassThrough ? value : this.type.encode(value);
        } else {
            this.value = 0;
        }
    }
    
    /**
     * 
     * @param {string} type 
     * @param {number} inputvalue 
     * @returns {number}
     */
    static encode(type, inputvalue) {
        const dataType = new DataType(type);
        return dataType.encode(inputvalue);
    }

    /**
     * 
     * @returns {number}
     */
    outputValue() {
        return this.type.decode(this.value);
        // switch (this.type.baseType) {
        //     case 'int':
        //         //uses 2s complement
        //         const value = ExtendedMath.bitSelect(this.value, 0, size-1);
        //         const sign = -ExtendedMath.bitSelectKeepOffset(this.value, size-1, 1);
        //         return value + sign;
        //     case 'u_int':
        //         return ExtendedMath.bitSelect(this.value, 0, size);
        //     case 'float':
        //         return ExtendedMath.bitSelect(this.value, 0, size);
        //     case 'u_float':
        //         return ExtendedMath.bitSelect(this.value, 0, size);
        //     default:
        //         return ExtendedMath.bitSelect(this.value, 0, size);;
        // }
    }

    /**
     * Gets the size of datatypes
     * @param {string} dataType 
     * @returns {number} the size
     */
    static sizeOf(dataType) {
        return new DataType(dataType).getSize();
    }

    /**
     * Creates an array of TypeValues
     * @param {string[]} types of the TypeValue
     * @param {number[]} values of the TypeValue
     * @param {boolean} isPreformatted true if the value should not be encoded into its type but interpreted as data rather than a value
     * @returns {TypeValue[]}
     */
    static arrayFromValues(types, values, isPreformatted = false) {
        if (types.length !== values.length) {
            return [];
        }
        return types.map((type, index) => new TypeValue(type, values[index], isPreformatted));
    }
}