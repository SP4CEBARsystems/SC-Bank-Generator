import CodePreset from "./code presets/CodePreset.js";
import { codePresets } from "./code presets/codePresets.js";
import { copyTextArrayToClipboard, removeLineBreaks } from "./copying.js";
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

    presetTypeElement = document.getElementById('preset-type');

    recursiveCopyButton = document.getElementById('recursive-copy-button');

    /**
     * @type {MemoryBankGenerator}
     */
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
            let classNames = 'preset-button ';
            switch (preset.type) {
                case 'ROM':
                    classNames += 'blue';
                    break;
                case 'Selector ROM':
                    classNames += 'red';
                    break;
                case 'FSM':
                    classNames += 'green';
                    break;
                default:
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

    recursiveCopy(event) {
        const flattenedBankData = this.generator.generatedData.flat(2);
        const readyBankData = flattenedBankData.map(removeLineBreaks);
        copyTextArrayToClipboard(readyBankData, false)
            .then(() => {
                console.log('successful copy');
                event.target.textContent = 'Copied';
            })
            .catch((error)=>console.error(error))
    }

    /**
     * 
     * @param {CodePreset} preset 
     * @returns {Promise<void>}
     */
    loadPreset(preset) {
        return new Promise((resolve, reject) => {
            if (
                this.codeInputElement === null ||
                this.amountInputElement === null ||
                this.inputSizesInputElement === null ||
                this.outputSizesInputElement === null ||
                this.presetNameElement === null ||
                this.presetTypeElement === null ||
                this.presetDescriptionElement === null
            ) {
                reject();
                return;
            }
            this.amountInputElement.value = preset.locations.toString();
            this.codeInputElement.value = preset.codeString;
            this.outputSizesInputElement.value = preset.outputTypes.toString();
            this.inputSizesInputElement.value = preset.inputTypes.toString();
            this.presetNameElement.textContent = preset.name;
            this.presetDescriptionElement.textContent = `${preset.description} ${preset.type === 'FSM' ? 'Note: this is an FSM (Finite State Machine). To use it, you should connect the output of the circuit to its input, read the documentation for more details.' : ''}`;
            this.presetTypeElement.textContent = `Type: ${preset.type}`;
            resolve();
        });
    }
}