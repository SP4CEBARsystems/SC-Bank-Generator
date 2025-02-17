import {init_code_sandbox} from "./code_sandbox.js";
import MemoryBankGenerator from "./memory_bank_generator.js";
import MemoryBankGeneratorUI from "./memory_bank_generator_ui.js";
import TypeValue from "./type_value.js";

// const generator = new MemoryBankGenerator(1, [4, 4], addition, [5]);
// const generator = new MemoryBankGenerator(1, [4, 4], subtraction, [4, 1]);
// const generator = new MemoryBankGenerator(1, [6, 1, 1], FSM, [6, 1, 1]);
// const generator = new MemoryBankGenerator(16, [4], display, [4]);
// const generator = new MemoryBankGenerator(16, [4], highResDisplay, [4]);

document.addEventListener( "DOMContentLoaded", runOnStart);

function runOnStart() {
    // functionTesting();
    const generatorUI = new MemoryBankGeneratorUI(
        new MemoryBankGenerator());
    init_code_sandbox();
}

function functionTesting() {
    for (let index = -256; index < 256; index++) {
        console.log(index, dec2bin(TypeValue.encode('int', index)), TypeValue.encode('int', index));
        // console.log(new TypeValue('u_int', index).outputValue());
    }

    function dec2bin(dec) {
        return (dec >>> 0).toString(2).padStart(8, '0');
      }
}
