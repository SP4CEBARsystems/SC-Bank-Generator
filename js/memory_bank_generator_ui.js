import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";

export default class MemoryBankGeneratorUI {
    /**
     * @type {HTMLParagraphElement | null}
     */
    paragraphElement = document.querySelector('p');

    /**
     * @type {HTMLTextAreaElement | null}
     */
    codeInputElement = document.querySelector('textarea');
    
    /**
     * @type {HTMLInputElement | null}
     */
    amountInputElement = document.getElementById('amount');
    
    /**
     * @type {HTMLInputElement | null}
     */
    inputSizesInputElement = document.getElementById('inputSizes');
    
    /**
     * @type {HTMLInputElement | null}
     */
    outputSizesInputElement = document.getElementById('outputSizes');

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

        if (this.paragraphElement) {
            generator.write(this.paragraphElement);
        }
    }
}