import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";

const generator = new MemoryBankGenerator(0);

console.log(generator.generate((bankIndex, bankPosition) => {
    const x = ExtendedMath.intDivMod(bankIndex, 1, 16);
    const y = ExtendedMath.intDivMod(bankIndex, 16, 16);
    return x + y;
}));

// console.log(ExtendedMath.getHexDigit(254, 0));
// console.log(ExtendedMath.getHexDigit(254, 1));
// console.log(ExtendedMath.getHexDigit(254, 2));
// console.log(ExtendedMath.getHexDigit(254, -1));