import Code from "./Code.js";

export default class CodePreset {
    /**
     * Generates a code preset
     * @param {string} name to be displayed
     * @param {Code} code to be executed
     * @param {string} description to be displayed
     * @param {number[]} codePresetValues to define parameters for the code
     * @param {string[]} inputTypes 
     * @param {string[]} outputTypes 
     * @param {number} locations 
     */
    constructor(name = 'Addition Example', code = new Code(), description = 'Adds two 4-bit numbers', codePresetValues = [], inputTypes = ['4', '4'], outputTypes = ['8'], locations = 1){
        this.name = name;
        this.code = code;
        this.description = description;
        this.codePresetValues = codePresetValues;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        this.locations = locations;
    }
}