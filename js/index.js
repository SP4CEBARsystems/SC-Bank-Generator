import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";
import Word from "./word.js";

const generator = new MemoryBankGenerator(1);

// generator.generate(addition);
// generator.generate(subtraction);
generator.generate(FSM);
// generator.generate(display, 16);
// generator.generate(highResDisplay, 16);

const paragraphElement = document.querySelector('p');
if (paragraphElement) {
    generator.write(paragraphElement);
}

function addition(bankIndex) {
    const inputSizes = [4, 4];
    const [x, y] = ExtendedMath.wordSplit(bankIndex, inputSizes);
    const value = x + y;
    return [
        new Word(5, value),
    ];
}

function subtraction(bankIndex) {
    const inputSizes = [4, 4];
    const [x, y] = ExtendedMath.wordSplit(bankIndex, inputSizes);
    const value = x - y;
    return [
        new Word(4, Math.abs(value)),
        new Word(1, (value < 0) ? 1 : 0),
    ];
}

function FSM(bankIndex) {
    const inputSizes = [6, 1, 1];
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
    return [
        new Word(inputSizes[0], position),
        new Word(inputSizes[1], (direction != 0) ? 1 : 0),
        new Word(inputSizes[2], 0),
    ];
}

function display(bankIndex, bankPosition) {
    const inputSizes = [4];
    const [x] = ExtendedMath.wordSplit(bankIndex, inputSizes);
    const value = x == bankPosition ? 0xf : 0x0;
    return [
        new Word(4, value),
    ];
}

function highResDisplay(bankIndex, bankPosition) {
    const inputSizes = [4];
    const [x] = ExtendedMath.wordSplit(bankIndex, inputSizes);
    const value = Math.floor(x/2) != bankPosition ? 0x0 :
        ((x % 2 == 0) ? 0x3 : 0xc);
    return [
        new Word(4, value),
    ];
}
