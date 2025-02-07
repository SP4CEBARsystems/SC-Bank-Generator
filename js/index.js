import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";

const generator = new MemoryBankGenerator(1);

// generator.generate((bankIndex, bankPosition) => {
//     const sizes = [4, 4]
//     const [x, y] = ExtendedMath.wordSplit(bankIndex, sizes);
//     return x + y;
// });

generator.generate((bankIndex, bankPosition) => {
    const sizes = [4, 4]
    const [x, y] = ExtendedMath.wordSplit(bankIndex, sizes);
    return x + y;
});

const paragraphElement = document.querySelector('p');
if (paragraphElement) {
    generator.write(paragraphElement);
}