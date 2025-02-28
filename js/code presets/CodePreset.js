import Code from "./Code.js";

export default class CodePreset {
    /**
     * Generates a code preset
     * @param {Code} code to be executed
     * @param {string} name to be displayed
     * @param {string} description to be displayed
     * @param {'ROM' | 'FSM' | 'Selector ROM'} type 
     * @param {string[]} inputTypes 
     * @param {string[]} outputTypes 
     * @param {any[]} codePresetValues to define parameters for the code
     * @param {number} locations 
     */
    constructor(code = new Code(), name = 'Addition Example', description = 'Adds two 4-bit numbers', type = 'ROM', inputTypes = ['4', '4'], outputTypes = ['8'], codePresetValues = [], locations = 1){
        this.code = code;
        this.name = name;
        this.description = description;
        this.type = type;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        this.codePresetValues = codePresetValues;
        this.locations = locations;
        this.formatCodeString(codePresetValues);
    }

    formatCodeString(codePresetValues) {
        const originalCode = reduceIndentation(this.code.code.toString());
        const matchLastParameterArrayWithDefault = /, *\[.*=[\s\S]*\](?=\) *=> *{)/gm;
        const [codeParameterNameSection, CodeWithoutParameters] = spliceFirstMatch(originalCode, matchLastParameterArrayWithDefault);
        const [codeParameterNames, codeParameterPresets] = extractParts(codeParameterNameSection);
        // console.log('codeParameterNameSection', codeParameterNameSection, codeParameterNames);
        if (codeParameterNameSection === '' || codeParameterNames === null) {
            this.codeString = originalCode;
            return;
        }
        const codeParameters = codeParameterNames.split(/, */gm);
        let codePresets;
        // try {
        //     codePresets = JSON.parse(`[${codeParameterPresets}]`);
        //     // console.log('codePresets', codePresets);
        // } catch (error) {
        //     codePresets = codeParameterPresets.split(/, */gm);
        //     // codePresets = codeParameterPresets.split(/(?<=\])\s*,\s*(?=\[)/gm);
        //     console.log('codePresets', codePresets, 'error', error, codeParameterPresets);
        // }
        codePresets = splitByTopLevelCommas(codeParameterPresets);
        // console.log('codePresets', codePresets, 'from', codeParameterPresets);

        const stringifiedCodePresetValues = codePresetValues.map((element) => JSON.stringify(element));
        
        const presets = (stringifiedCodePresetValues !== undefined && stringifiedCodePresetValues.length > 0) ? stringifiedCodePresetValues : codePresets;
        // if ((stringifiedCodePresetValues !== undefined && stringifiedCodePresetValues.length > 0)) console.log('presets', stringifiedCodePresetValues, codePresets);

        let parametersInCode = parametersToDeclarations();

        const matchFunctionHeader = /^\( *\[.*\],.*\) *=> *{/m;
        // inputParameters.reduce((accumulator, current) => accumulator + `const ${current} = ${value};`)
        // Example usage:
        this.codeString = insertAfterMatch(CodeWithoutParameters, matchFunctionHeader, parametersInCode);

        function parametersToDeclarations() {
            let parametersInCode = "";
            for (let index = 0; index < codeParameters.length; index++) {
                const inputParameter = codeParameters[index];
                const presetValue = presets[index];
                //JSON.stringify(presetValue)
                const codePresetValue = isNaN(presetValue) ? presetValue : presetValue;
                parametersInCode += `\r\n    const ${inputParameter} = ${codePresetValue};`;
                // if(isNaN(presetValue)) console.log('presetValue', presetValue, isNaN(presetValue), codePresetValue);
            }
            parametersInCode = `\r\n    //PARAMETERS:${parametersInCode}\r\n`;
            return parametersInCode;
        }

        function reduceIndentation(str) {
            return str.replace(/^ {1,8}/gm, ""); // Match up to 8 leading spaces and remove them
        }

        function insertAfterMatch(str, regex, insertStr) {
            return str.replace(regex, (match) => match + insertStr);
        }

        function extractVariableNames(str) {
            const match = str.match(/^, *\[(.*?)\] = \[.*\]$/);
            return match ? match[1] : null; // Extract the first capturing group
        }

        function extractParts(str) {
            const regex = /^, *\[(.*?)\] = \[([\s\S]*)\]$/; // Capture both sections separately
            const match = str.match(regex);
            return match ? [match[1], match[2]] : [null, null];
        }

        function spliceFirstMatch(str, regex) {
            const match = str.match(regex);
            if (!match) return ["", str]; // No match found
            const removed = match[0];
            const newStr = str.replace(regex, ""); // Remove only the first match
            return [removed, newStr];
        }

        function splitByTopLevelCommas(input) {
            let parts = [];
            let start = 0;
            let stack = 0; // Tracks nesting depth
        
            for (let i = 0; i < input.length; i++) {
                if (input[i] === "[") stack++;
                if (input[i] === "]") stack--;
        
                if (input[i] === "," && stack === 0) {
                    parts.push(input.slice(start, i).trim()); // Push the current segment
                    start = i + 1; // Move start to after the comma
                }
            }
        
            parts.push(input.slice(start).trim()); // Add the last segment
            return parts;
        }        
    }
}