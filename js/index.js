import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";
import Word from "./word.js";

const generator = new MemoryBankGenerator(1);

// generator.generate((bankIndex, bankPosition) => {
//     const sizes = [4, 4]
//     const [x, y] = ExtendedMath.wordSplit(bankIndex, sizes);
//     return x + y;
// });

generator.generate((bankIndex, bankPosition) => {
    const inputSizes = [4, 4]
    const [x, y] = ExtendedMath.wordSplit(bankIndex, inputSizes);
    const value = x - y;
    const output = [
        new Word(4, Math.abs(value)),
        new Word(1, (value < 0)? 1:0 ),
    ]
    const out = ExtendedMath.combineOutput(output);
    // console.log(Math.abs(value), out.toString(16));
    return out;
});

const paragraphElement = document.querySelector('p');
if (paragraphElement) {
    generator.write(paragraphElement);
}