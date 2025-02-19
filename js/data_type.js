import ExtendedMath from "./extended_math.js"

export default class DataType {
    size

    exponentialOffset

    floatExponentSize

    floatMantissaSize

    isSigned

    baseType
    
    /**
     * 
     * @param {string} rawDataType 
     */
    constructor(rawDataType) {
        const dataType = rawDataType.toLowerCase();
        this.size = ExtendedMath.matchFirstAsInt(dataType, /(\d+)$/);
        this.exponentialOffset = ExtendedMath.matchFirstAsInt(dataType, /(?<=_o)\d+/);
        this.floatExponentSize = ExtendedMath.matchFirstAsInt(dataType, /(?<=_e)\d+/);
        this.floatMantissaSize = ExtendedMath.matchFirstAsInt(dataType, /(?<=_m)\d+/);
        this.isSigned = !ExtendedMath.hasMatch(dataType, /^u(?=_)/);
        this.baseType = ExtendedMath.matchFirst(dataType, /int|float|double|byte|nibble|bit|flag|boolean|bool/);
    }

    getSize(){
        if (this.size !== null) return this.size;
        switch (this.baseType) {
            case 'float': case 'double':
            return (this.floatExponentSize??0) + (this.floatMantissaSize??0) + (this.isSigned? 1:0);
        }
        const typeSpecificSize = this.getTypeSpecificSize();
        if (typeSpecificSize !== null) return typeSpecificSize;
        return 0;
    }

    setAll(size, exponentialOffset, floatExponentSize, floatMantissaSize, isSigned, baseType){
        this.size = size;
        this.exponentialOffset = exponentialOffset;
        this.floatExponentSize = floatExponentSize;
        this.floatMantissaSize = floatMantissaSize;
        this.isSigned = isSigned;
        this.baseType = baseType;
    }

    /**
     * 
     * @returns {number|null}
     */
    getTypeSpecificSize(){
        switch (this.baseType) {
            case '': case undefined: case null:
                return null;
            case 'bit': case 'flag': case 'bool': case 'boolean':
                return 1;
            case 'nibble':
                return 4;
            case 'byte':
                return 8;
            case 'int':
                return 16;
            case 'u_int':
                return 16;
            case 'float':
                return 32;
            case 'double':
                return 64;
            default:
                return null;
        }
    }

    /**
     * 
     * @param {string} dataType 
     * @returns {string}
     */
    reduceType(dataType) {
        switch (dataType) {
            case '':
            case undefined:
            case null:
                return 'null';
        }
        const parts = dataType.toString().toLowerCase().split(/(\d+)$/);
        new DataType(dataType);
        //this functionality is needed in the encoders and decoders , also remove last underscore
        if (parts.length < 1) {
            return 'null';
        } else if (parts.length >= 2) {
            return parts[1];
        }
        switch (parts[0]) {
            case 'bit':
            case 'flag':
            case 'bool':
            case 'boolean':
                return 'u_int_1';
            case 'nibble':
                return 'u_int_4';
            case 'byte':
                return 'u_int_8';
            case 'int':
                return 'int_16';
            case 'u_int':
                return 'u_int_16';
            case 'float':
                return 'float_32';
            case 'double':
                return 'float_64';
            default:
                return 'null';
        }
    }

    
    /**
     * 
     * @param {number} inputvalue 
     */
    encode(inputvalue) {
        const size = this.getSize();
        switch (this.baseType) {
            case 'int':
                if (this.isSigned) {
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
                } else {
                    return ExtendedMath.toWord(Math.abs(inputvalue), size);
                }
            case 'byte': case 'nibble': case 'bit': case 'flag': case 'boolean': case 'bool':
                return ExtendedMath.toWord(Math.abs(inputvalue), size);
            case 'float': case 'double':
                return ExtendedMath.toWord(Math.abs(inputvalue), size)
            default:
                return ExtendedMath.toWord(Math.abs(inputvalue), size);
        }
    }

    /**
     * 
     * @param {number} inputValue
     * @returns {number}
     */
    decode(inputValue) {
        const size = this.getSize();
        switch (this.baseType) {
            case 'int':
                if (this.isSigned) {
                    //uses 2s complement
                    const value = ExtendedMath.bitSelect(inputValue, 0, size-1);
                    const sign = -ExtendedMath.bitSelectKeepOffset(value, size-1, 1);
                    return value + sign;
                } else {
                    return ExtendedMath.bitSelect(inputValue, 0, size);
                }
            case 'float':
                return ExtendedMath.bitSelect(inputValue, 0, size);
            case 'byte': case 'nibble': case 'bit': case 'flag': case 'boolean': case 'bool':
                return ExtendedMath.bitSelect(inputValue, 0, size);
            default:
                return ExtendedMath.bitSelect(inputValue, 0, size);;
        }
    }
}