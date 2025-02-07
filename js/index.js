import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";

const generator = new MemoryBankGenerator(1);

generator.generate((bankIndex, previousOutput, bankPosition) => {
    const x = ExtendedMath.intDivMod(bankIndex, 1, 16);
    const y = ExtendedMath.intDivMod(bankIndex, 16, 16);
    // return x + y;
    return previousOutput + 1;
});

const paragraphElement = document.querySelector('p');
if (paragraphElement) {
    generator.write(paragraphElement);
}