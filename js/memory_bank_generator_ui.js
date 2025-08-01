import CodePreset from "./code presets/CodePreset.js";
import { codePresets } from "./code presets/codePresets.js";
import { copyTextArrayToClipboard, removeLineBreaks } from "./copying.js";
import { newButton, newElement } from "./dom_manipulator.js";
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

    slowerRecursiveCopyButton = document.getElementById('slower-recursive-copy-button');
    
    recursiveCopyButtonDefaultText;
    
    slowerRecursiveCopyButtonDefaultText;

    /**
     * @type {MemoryBankGenerator}
     */
    generator

    constructor(generator) {
        this.recursiveCopyButtonDefaultText = this.recursiveCopyButton.textContent;
        this.slowerRecursiveCopyButtonDefaultText = this.slowerRecursiveCopyButton.textContent;
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
        if (this.slowerRecursiveCopyButton) {
            this.slowerRecursiveCopyButton.onclick = this.recursiveCopySlower.bind(this);
        }
        const presetSelector = document.getElementById("preset-selector");
        if(!presetSelector) return;
        // this.loadPreset.bind(this);
        const loadingIndicator = presetSelector.querySelector('.loading-indicator');
        console.log('loadingIndicator', loadingIndicator)
        loadingIndicator?.remove;
        if (loadingIndicator) {
            loadingIndicator.remove();
            console.log('removed leadingIndicator')
        }
        if (codePresets === undefined || codePresets === null) {
            newElement('p', 'Failed to load presets, please click on "report issue" below this page to write a bug report.', 'error-message', presetSelector);
        } else if (codePresets.length <= 0) {
            newElement('p', 'No presets are available, please click on "report issue" below this page to write a bug report.', 'error-message', presetSelector);
        } else {
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
    }

    generate() {
        this.recursiveCopyButton.textContent = this.recursiveCopyButtonDefaultText;
        this.slowerRecursiveCopyButton.textContent = this.slowerRecursiveCopyButtonDefaultText;
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

    /**
     * 
     * @param {MouseEvent} event 
     * @param {boolean} hasSlowerMode 
     */
    recursiveCopy(event, hasSlowerMode) {
        const flattenedBankData = this.generator.generatedData.flat(2);
        const readyBankData = flattenedBankData.map(removeLineBreaks);
        if (event.target === null) return;

        const targetElement = /** @type {HTMLElement} */ (event.target);
        targetElement.textContent = 'Copying...'
        copyTextArrayToClipboard(readyBankData, hasSlowerMode)
            .then(() => {
                console.log('successful copy');
                targetElement.textContent = 'Copied';
            })
            .catch((error)=>{
                console.error(error);
                targetElement.textContent = 'Failed to copy'
            })
    }

    recursiveCopySlower(event) {
        this.recursiveCopy.bind(this)(event, true);
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
            const fsmDescription = 'Note: this is an FSM (Finite State Machine). To use it, you should connect the output of the circuit to its input, read the documentation for more details.';
            // const fsmSuffix = "Note that for an FSM to work you should connect the output of a memory bank system to its (location) input";
            this.presetDescriptionElement.textContent = `${preset.description} ${preset.type === 'FSM' ? fsmDescription : ''}`;
            this.presetTypeElement.textContent = `Type: ${preset.type}`;
            resolve();
        });
    }
}
