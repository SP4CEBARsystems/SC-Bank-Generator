export default class Segment {
    /**
     * Creates a new named bit-segment
     * @param {string} name of the segment
     * @param {number} size of the segment in bits
     */
    constructor(name, size, exponent = 0){
        this.name = name;
        this.size = size;
        this.exponent = exponent;
    }
}