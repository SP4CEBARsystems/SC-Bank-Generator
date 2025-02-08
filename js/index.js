import ExtendedMath from "./extended_math.js";
import MemoryBankGenerator from "./memory_bank_generator.js";
import Word from "./word.js";

// const generator = new MemoryBankGenerator(1, [4, 4], addition, [5]);
const generator = new MemoryBankGenerator(1, [4, 4], subtraction, [4, 1]);
// const generator = new MemoryBankGenerator(1, [6, 1, 1], FSM, [6, 1, 1]);
// const generator = new MemoryBankGenerator(16, [4], display, [4]);
// const generator = new MemoryBankGenerator(16, [4], highResDisplay, [4]);

generator.generate();

const paragraphElement = document.querySelector('p');
if (paragraphElement) {
    generator.write(paragraphElement);
}

/**
 * 
 * @param {number[]} param0 
 * @returns 
 */
function addition([x, y]) {
    const value = x + y;
    return [value];
}

/**
 * 
 * @param {number[]} param0 
 * @returns 
 */
function subtraction([x, y]) {
    const value = x - y;
    return [Math.abs(value), (value < 0) ? 1:0];
}

function FSM([position, direction, reset]) {
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
    return [position, direction, 0];
}

function display([x], bankPosition) {
    const value = x == bankPosition ? 0xf : 0x0;
    return [value];
}

function highResDisplay([x], bankPosition) {
    const value = Math.floor(x/2) != bankPosition ? 0x0 :
        ((x % 2 == 0) ? 0x3 : 0xc);
    return [value];
}
