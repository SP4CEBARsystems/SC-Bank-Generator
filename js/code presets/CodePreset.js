import Code from "./Code.js";

export default class CodePreset {
    /**
     * Generates a code preset
     * @param {Code} code to be executed
     * @param {string} name to be displayed
     * @param {string} description to be displayed
     * @param {string[]} inputTypes 
     * @param {string[]} outputTypes 
     * @param {number[]} codePresetValues to define parameters for the code
     * @param {number} locations 
     */
    constructor(code = new Code(), name = 'Addition Example', description = 'Adds two 4-bit numbers', inputTypes = ['4', '4'], outputTypes = ['8'], codePresetValues = [], locations = 1){
        this.code = code;
        this.name = name;
        this.description = description;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        this.codePresetValues = codePresetValues;
        this.locations = locations;
    }
}