export default class Code {
    /**
     * Holds code in a specific format to be used as a preset 
     * @param {(bankIndex:number[], bankPosition:number, presets:any[]) => number[]} code
     */
    constructor(code = ([x, y]) => [x + y]) {
        this.code = code;
    }
}