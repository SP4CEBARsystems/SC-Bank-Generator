import ExtendedMath from "./extended_math.js"
import Segment from "./segment.js"
import Word from "./word.js"

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
        this.rectifyFloatParameters();
    }

    rectifyFloatParameters() {
        if (this.floatExponentSize === null && this.floatMantissaSize !== null && this.size !== null) {
            this.floatExponentSize = this.size - (this.getSignSize() + this.floatMantissaSize);
        } else if (this.floatExponentSize !== null && this.floatMantissaSize === null && this.size !== null) {
            this.floatMantissaSize = this.size - (this.getSignSize() + this.floatExponentSize);
        } else if (this.floatExponentSize !== null && this.floatMantissaSize !== null || this.size === null) {
            this.size = this.getFloatSize();
        } else {
            this.size = this.getFloatSize();
        }
    }

    getFloatSize() {
        return this.getSignSize() + (this.floatExponentSize ?? 3) + (this.floatMantissaSize ?? 4);
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
     * Encodes a number according to this DataType object.
     * @param {number} inputValue the numerical value to be encoded to data
     * @returns {number} the binary-encoded representation in the object's data type
     */
    encode(inputValue) {
        // inputValue *= 2 ** (this.exponentialOffset ?? 0);
        const size = this.getSize();
        switch (this.baseType) {
            case 'int':
                if (this.isSigned) {
                    if (this.isSignedTwosComplement) {                        
                        //uses 2s complement
                        const signValue = 1 << (size - 1);
                        const isNegative = inputValue < 0;
                        const value = ExtendedMath.toWord(Math.abs(inputValue), size-1);
                        if (isNegative) {
                            return signValue * 2 - value;
                        } else {
                            return value;
                        }
                    } else {
                        const signValue = 1 << (size - 1);
                        const isNegative = inputValue < 0;
                        const value = ExtendedMath.toWord(Math.abs(inputValue), size-1);
                        if (isNegative) {
                            return signValue | value;
                        } else {
                            return value;
                        }
                    }
                } else {
                    return ExtendedMath.toWord(Math.abs(inputValue), size);
                }
            case 'byte': case 'nibble': case 'bit': case 'flag': case 'boolean': case 'bool':
                return ExtendedMath.toWord(Math.abs(inputValue), size);
            case 'float': case 'double':
                if (this.floatExponentSize === null || this.floatMantissaSize === null) {
                    return ExtendedMath.toWord(Math.abs(inputValue), size)
                }
                const signBits = new Word(this.getSignSize(),
                    inputValue < 0 ? 1 : 0,
                );
                const exponentBits = new Word(this.floatExponentSize,
                    Math.log2(inputValue)
                );
                const mantissaBits = new Word(this.floatMantissaSize,
                    inputValue / 2 ** exponentBits.value
                );
                return Word.mergeWords(signBits, exponentBits, mantissaBits).value;
            default:
                return ExtendedMath.toWord(Math.abs(inputValue), size);
        }
    }

    /**
     * Decodes data according to this DataType object.
     * @param {number} inputData the binary-encoded representation in the object's data type to be decoded to a value
     * @returns {number} the numerical value
     */
    decode(inputData) {
        // before returning, this needs to be applied in reverse: inputValue *= 2 ** (this.exponentialOffset ?? 0);
        const size = this.getSize();
        switch (this.baseType) {
            case 'int':
                if (this.isSigned) {
                    if (this.isSignedTwosComplement) {
                        //uses 2s complement
                        const value = ExtendedMath.bitSelect(inputData, 0, size-1);
                        const sign = -ExtendedMath.bitSelectKeepOffset(inputData, size-1, 1);
                        return value + sign;
                    } else {
                        const value = ExtendedMath.bitSelect(inputData, 0, size-1);
                        const sign = ExtendedMath.bitSelect(inputData, size-1, 1) != 0 ? -1 : 1;
                        return value * sign;
                    }
                } else {
                    return ExtendedMath.bitSelect(inputData, 0, size);
                }
            case 'float':
                return ExtendedMath.bitSelect(inputData, 0, size);
            case 'byte': case 'nibble': case 'bit': case 'flag': case 'boolean': case 'bool':
                return ExtendedMath.bitSelect(inputData, 0, size);
            default:
                return ExtendedMath.bitSelect(inputData, 0, size);;
        }
    }
}