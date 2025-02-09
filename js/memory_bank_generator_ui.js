import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";

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

    constructor() {
        if (this.codeInputElement) {
            this.codeInputElement.textContent = '([x, y]) => {\n    return [x + y];\n}'
        }
        if (this.generateButton) {
            this.generateButton.onclick = this.generate.bind(this);
        }
    }

    generate() {
        if (this.codeInputElement?.value === undefined ||
            this.amountInputElement?.value === undefined ||
            this.inputSizesInputElement?.value === undefined ||
            this.outputSizesInputElement?.value === undefined
        ) {
            return;
        }

        const inputSizesArray = ExtendedMath.stringToArray(this.inputSizesInputElement.value);
        const outputsSizesArray = ExtendedMath.stringToArray(this.outputSizesInputElement.value);
        const generator = new MemoryBankGenerator(
            parseInt(this.amountInputElement.value),
            inputSizesArray,
            eval(this.codeInputElement.value),
            outputsSizesArray
        );
        generator.generate();

        generator.write();
    }
}