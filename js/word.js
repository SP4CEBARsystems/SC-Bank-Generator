export default class Word {
    bitSize;

    value;

    /**
     * 
     * @param {number} bitSize 
     * @param {number} value 
     */
    constructor(bitSize, value) {
        this.bitSize = bitSize;
        this.value = value;
    }
}