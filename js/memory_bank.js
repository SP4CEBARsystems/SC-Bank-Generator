import { copyTextToClipboard } from "./copying.js";
import MemoryBankGenerator from "./memory_bank_generator.js";
import MemoryBankGeneratorUI from "./memory_bank_generator_ui.js";

// const generator = new MemoryBankGenerator(1, [4, 4], addition, [5]);
// const generator = new MemoryBankGenerator(1, [4, 4], subtraction, [4, 1]);
// const generator = new MemoryBankGenerator(1, [6, 1, 1], FSM, [6, 1, 1]);
// const generator = new MemoryBankGenerator(16, [4], display, [4]);
// const generator = new MemoryBankGenerator(16, [4], highResDisplay, [4]);

document.addEventListener( "DOMContentLoaded", runOnStart);

function runOnStart() {
    const generatorUI = new MemoryBankGeneratorUI();
    assignCodeBlockCopyButtons();
}

function assignCodeBlockCopyButtons() {
    const codeBlockElements = document.querySelectorAll('.code-block-root');
    for (const codeBlockElement of codeBlockElements) {
        console.log(codeBlockElement);
        if (codeBlockElement === null) continue;
        const codeContainer = codeBlockElement.querySelector('.code-block');
        if (codeContainer === null) continue;
        codeBlockElement.querySelector('.copy-btn')?.addEventListener('click', 
            () => copyTextToClipboard(codeContainer.textContent)
        );
    }
}

