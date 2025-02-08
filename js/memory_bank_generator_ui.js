import MemoryBankGenerator from "./memory_bank_generator.js";

export default class MemoryBankGeneratorUI {
    paragraphElement = document.querySelector('p');

    codeInputElement = document.querySelector('textarea');
    amountInputElement = document.getElementById('amount');
    inputSizesInputElement = document.getElementById('inputSizes');
    outputSizesInputElement = document.getElementById('outputSizes');

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

        const generator = new MemoryBankGenerator(
            this.amountInputElement.value,
            eval(this.inputSizesInputElement.value),
            eval(this.codeInputElement.value),
            eval(this.outputSizesInputElement.value)
        );
        generator.generate();

        if (this.paragraphElement) {
            generator.write(this.paragraphElement);
        }
    }
}