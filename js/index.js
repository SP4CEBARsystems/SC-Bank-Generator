import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";
import Word from "./word.js";

const generator = new MemoryBankGenerator(1);

// generator.generate((bankIndex, bankPosition) => {
//     const sizes = [4, 4]
//     const [x, y] = ExtendedMath.wordSplit(bankIndex, sizes);
//     return x + y;
// });

// generator.generate((bankIndex, bankPosition) => {
//     const inputSizes = [4, 4]
//     const [x, y] = ExtendedMath.wordSplit(bankIndex, inputSizes);
//     const value = x - y;
//     const output = [
//         new Word(4, Math.abs(value)),
//         new Word(1, (value < 0)? 1:0 ),
//     ]
//     const out = ExtendedMath.combineOutput(output);
//     // console.log(Math.abs(value), out.toString(16));
//     return out;
// });

generator.generate((bankIndex, bankPosition) => {
    const inputSizes = [6, 1, 1]
    let [position, direction, reset] = ExtendedMath.wordSplit(bankIndex, inputSizes);
    const maxPosition = 63;
    const minPosition = 0;
    if (reset != 0) {
        position = 0;
        direction = 0;
    } else {
        if (position >= maxPosition && direction == 0) {
            direction = 1;
        } else if (position <= minPosition && direction != 0) {
            direction = 0;
        } else {
            position += (direction != 0 ? -1 : 1);
        }
    }
    const output = [
        new Word(6, position),
        new Word(1, (direction != 0)? 1:0 ),
        new Word(1, 0 ),
    ]
    const out = ExtendedMath.combineOutput(output);
    // console.log(Math.abs(value), out.toString(16));
    return out;
});

const paragraphElement = document.querySelector('p');
if (paragraphElement) {
    generator.write(paragraphElement);
}