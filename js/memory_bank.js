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
}
