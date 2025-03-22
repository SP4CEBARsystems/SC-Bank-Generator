import CodePreset from "./code presets/CodePreset.js";
import { codePresets } from "./code presets/codePresets.js";
import { copyTextArrayToClipboard } from "./copying.js";
import { newButton } from "./dom_manipulator.js";
import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";
// import {runUserFunction} from "./code_sandbox.js";

export default class MemoryBankGeneratorUI {
    /**
     * @type {HTMLTextAreaElement | null}
     */
    codeInputElement = document.querySelector('textarea');
    
    amountInputElement = /** @type {HTMLInputElement | null} */ (document.getElementById('amount'));
    
    inputSizesInputElement = /** @type {HTMLInputElement | null} */ (document.getElementById('inputSizes'));
    
    outputSizesInputElement = /** @type {HTMLInputElement | null} */ (document.getElementById('outputSizes'));

    /**
     * @type {HTMLButtonElement | null}
     */
    generateButton = document.querySelector('button');

    statisticsParagraph = document.getElementById('bank-statistics');
    
    presetNameElement = document.getElementById('preset-name');

    presetDescriptionElement = document.getElementById('preset-description');

    recursiveCopyButton = document.getElementById('recursive-copy-button');

    generator

    constructor(generator) {
        this.generator = generator;
        if (this.codeInputElement) {
            this.codeInputElement.textContent = '([x, y]) => {\n    return [x + y];\n}'
        }
        if (this.generateButton) {
            this.generateButton.onclick = this.generate.bind(this);
        }
        if (this.recursiveCopyButton) {
            this.recursiveCopyButton.onclick = this.recursiveCopy.bind(this);
        }
        const presetSelector = document.getElementById("preset-selector");
        if(!presetSelector) return;
        // this.loadPreset.bind(this);
        codePresets.forEach((preset) => {
            let classNames;
            switch (preset.type) {
                case 'ROM':
                    classNames = 'blue';
                    break;
                case 'Selector ROM':
                    classNames = 'red';
                    break;
                case 'FSM':
                    classNames = 'green';
                    break;
                default:
                    classNames = '';
                    break;
            }
            newButton(preset.name, classNames, presetSelector, this.loadPreset.bind(this), [preset]);
        })
    }

    generate() {
        this.revealHiddenElements();
        // runUserFunction()
        const generator = this.generator;
        if (this.codeInputElement?.value === undefined ||
            this.amountInputElement?.value === undefined ||
            this.inputSizesInputElement?.value === undefined ||
            this.outputSizesInputElement?.value === undefined) return;

        const inputSizesArray = ExtendedMath.stringToArray(this.inputSizesInputElement.value);
        const outputsSizesArray = ExtendedMath.stringToArray(this.outputSizesInputElement.value);
        generator.init(
            parseInt(this.amountInputElement.value),
            inputSizesArray,
            // eval(this.codeInputElement.value),
            outputsSizesArray
        );
        generator.clear();
        generator.generate();
        // generator.write();

        if (this.statisticsParagraph) {
            this.statisticsParagraph.textContent = generator.getStats();
        }
    }

    revealHiddenElements() {
        const elementsToBeRevealed = [...document.querySelectorAll('.initially-hidden')];
        for (const element of elementsToBeRevealed) {
            element.classList.remove('initially-hidden');
        }
    }

    recursiveCopy() {
        const flattenedBankData = this.generator.generatedData.flat(2);
        copyTextArrayToClipboard(flattenedBankData, false)
            .then(() => console.log('successful copy'))
            .catch((error)=>console.error(error))
    }

    /**
     * 
     * @param {CodePreset} preset 
     */
    loadPreset(preset) {
        if (
            this.codeInputElement === null ||
            this.amountInputElement === null ||
            this.inputSizesInputElement === null ||
            this.outputSizesInputElement === null ||
            this.presetNameElement === null ||
            this.presetDescriptionElement === null
        ) return;
        this.amountInputElement.value = preset.locations.toString();
        this.codeInputElement.value = preset.codeString;
        this.outputSizesInputElement.value = preset.outputTypes.toString();
        this.inputSizesInputElement.value = preset.inputTypes.toString();
        this.presetNameElement.textContent = preset.name;
        this.presetDescriptionElement.textContent = preset.description;
    }
}