import ExtendedMath from "./extended_math.js"
import Segment from "./segment.js"

export default class DataType {
    size

    exponentialOffset

    floatExponentSize

    floatMantissaSize

    isSigned

    isSignedTwosComplement

    baseType
    
    /**
     * 
     * @param {string} rawDataType 
     */
    constructor(rawDataType) {
        const dataType = rawDataType.toLowerCase();
        const baseType = ExtendedMath.matchFirst(dataType, /int|float|double|byte|nibble|bit|flag|boolean|bool/);
        const isSetDefault = baseType === null
        this.baseType = isSetDefault ? 'int' : baseType;
        this.size = ExtendedMath.matchFirstAsInt(dataType, /(\d+)$/);
        this.isSigned = isSetDefault ? false : !ExtendedMath.hasMatch(dataType, /^u(?=_)/);
        this.isSignedTwosComplement = this.isSigned && !ExtendedMath.hasMatch(dataType, /^(sm)(?=_)/);
        this.exponentialOffset = ExtendedMath.matchFirstAsInt(dataType, /(?<=_o)\d+/);
        this.floatExponentSize = ExtendedMath.matchFirstAsInt(dataType, /(?<=_e)\d+/);
        this.floatMantissaSize = ExtendedMath.matchFirstAsInt(dataType, /(?<=_m)\d+/);
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

    getName(){
        if (this.baseType === null) return 'null';
        const prefix = !this.isSigned ? 'u_' : this.isSignedTwosComplement ? '' : 'sm_';
        const suffix = `_${this.getSize()}`;
        return prefix + this.baseType + suffix;
    }

    getFullName(){
        if (this.baseType === null) return 'null';
        const prefix = !this.isSigned ? 'unsigned' : this.isSignedTwosComplement ? "two's complement signed" : 'sign magnitude signed';
        return `${prefix} ${this.getBaseTypeFullName()}`;
    }

    getFullNameWithSize(){
        const suffix = `of size ${this.getSize()}`;
        return `${this.getFullName()} ${suffix}`;
    }

    getBaseSize(){
        return this.getSize() - this.getSignSize();
    }

    getSignSize(){
        return this.isSigned ? 1 : 0;
    }

    getBaseTypeFullName() {
        switch (this.baseType) {
            case 'bit': case 'flag': case 'nibble': case 'byte':
                return this.baseType;
            case 'bool': case 'boolean':
                return 'boolean value'
            case 'int':
                return 'integer'
            case 'float':
                return 'floating point number'
            case 'double':
                return 'double precision floating point number'
            case '': case undefined: case null:
            default:
                return 'unknown type'
        }
    }

    getSegments(){
        const segments = [
            new Segment('number', this.getBaseSize()),
        ];
        if (this.isSigned) {
            segments.push(
                new Segment(this.isSignedTwosComplement ? "two's complement sign" : 'sign magnitude sign', this.getSignSize(), this.getBaseSize())
            );
        }
        return segments;
    }

    /**
     * 
     * @param {*} size 
     * @param {*} exponentialOffset 
     * @param {*} floatExponentSize 
     * @param {*} floatMantissaSize 
     * @param {*} isSigned 
     * @param {*} isSignedTwosComplement 
     * @param {*} baseType 
     */
    setAll(size, exponentialOffset, floatExponentSize, floatMantissaSize, isSigned, isSignedTwosComplement, baseType){
        this.size = size;
        this.exponentialOffset = exponentialOffset;
        this.floatExponentSize = floatExponentSize;
        this.floatMantissaSize = floatMantissaSize;
        this.isSigned = isSigned;
        this.isSignedTwosComplement = isSignedTwosComplement;
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
    static reduceType(dataType) {
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
                    if (this.isSignedTwosComplement) {                        
                        //uses 2s complement
                        const signValue = 1 << (size - 1);
                        const isNegative = inputvalue < 0;
                        const value = ExtendedMath.toWord(Math.abs(inputvalue), size-1);
                        if (isNegative) {
                            return signValue * 2 - value;
                        } else {
                            return value;
                        }
                    } else {
                        const signValue = 1 << (size - 1);
                        const isNegative = inputvalue < 0;
                        const value = ExtendedMath.toWord(Math.abs(inputvalue), size-1);
                        if (isNegative) {
                            return signValue | value;
                        } else {
                            return value;
                        }
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
                    if (this.isSignedTwosComplement) {
                        //uses 2s complement
                        const value = ExtendedMath.bitSelect(inputValue, 0, size-1);
                        const sign = -ExtendedMath.bitSelectKeepOffset(inputValue, size-1, 1);
                        return value + sign;
                    } else {
                        const value = ExtendedMath.bitSelect(inputValue, 0, size-1);
                        const sign = ExtendedMath.bitSelect(inputValue, size-1, 1) != 0 ? -1 : 1;
                        return value * sign;
                    }
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