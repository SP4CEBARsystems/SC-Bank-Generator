import Code from "./Code.js";

export default class standardCode {
    static addition = new Code(
        ([x, y]) => {
            return [x + y];
        }
    )

    static manualSubtraction = new Code(
        ([x, y]) => {
            const value = x - y;
            return [Math.abs(value), (value < 0) ? 1:0];
        }
    )

    static subtraction = new Code(
        ([x, y]) => {
            return [x - y];
        }
    )

    static hexToDec = new Code(
        ([x], bankPosition, [digits] = [3]) => {
            const accumulator = [];
            for (let index = 0; index < digits; index++) {
                accumulator.push(Math.floor(x / (10 ** index)) % 10);
            }
            return accumulator;
        }
    )

    static decToHex = new Code(
        ([...digits]) => {
            return [digits.reduce((accumulator, element, index) => accumulator + element * (10 ** index))];
        }
    )

    static typeConverter = new Code(
        ([x]) => {
            return [x];
        }
    )

    static bitMaskAndShift = new Code(
        ([x], bankPosition, [bitShiftLeftAmount, bitShiftRightAmount, bitMask] = [4, 1, 0b1111]) => {
            const masked = x & bitMask;
            const maskedAndShiftedLeft = masked << bitShiftLeftAmount;
            return [maskedAndShiftedLeft >> bitShiftRightAmount];
        }
    )

    static incrementCounterFsm = new Code(
        ([x], bankPosition, [maxValue] = [0xff]) => {
            if(x == maxValue) return [0];
            return [x + 1];
        }
    )

    static counterFsm = new Code(
        ([position, isMoving, isDecrementing], bankPosition, [minPosition, maxPosition, isOverflowEnabled] = [0, 15, 1]) => {
            const [underflowValue, overflowValue] = isOverflowEnabled ? [maxPosition, minPosition] : [position, position];
            if (isMoving == 0) {
                if (isDecrementing != 0) {
                    position = 0;
                }
            } else {
                if(position >= maxPosition && isDecrementing == 0) {
                    position = overflowValue
                } else if(position <= minPosition && isDecrementing != 0) {
                    position = underflowValue
                } else {
                    position += (isDecrementing != 0 ? -1 : 1);
                }
            }
            return [position];
        }
    )

    static bouncyCounterFsm = new Code(
        ([position, isDecrementing, isResetting], bankPosition, [maxPosition, minPosition] = [63, 0]) => {
            if (isResetting != 0) {
                position = 0;
                isDecrementing = 0;
            } else {
                if (position >= maxPosition && isDecrementing == 0) {
                    isDecrementing = 1;
                } else if (position <= minPosition && isDecrementing != 0) {
                    isDecrementing = 0;
                } else {
                    position += (isDecrementing != 0 ? -1 : 1);
                }
            }
            return [position, isDecrementing];
        }
    )

    static cpuFsm = new Code(
        ([programCounter, accumulator, addressRegister, instructionRegister, isCycleExecute], bankPosition, [instructionSet, assemblyProgram, programData] = [
            ['halt', 'load', 'subtract', 'branchIfNotZero'], 
            [
                {instruction: 1, address: 0}, // load the first value from programData into the accumulator
                {instruction: 2, address: 1}, // subtract the second value of programData from the accumulator
                {instruction: 3, address: 0}, // jump (branch) to the first instruction if the accumulator is not zero
                {instruction: 0, address: 0}, // stop the program
            ],
            [3, 1, 0, 0]
        ]) => {
            if (isCycleExecute == 0){
                isCycleExecute = 1;
                instructionRegister = assemblyProgram[programCounter].instruction;
                addressRegister = assemblyProgram[programCounter].address;
            } else {
                isCycleExecute = 0;
                programCounter += 1;
                const currentValue = programData[addressRegister];
                const instruction = instructionSet[instructionRegister];
                switch(instruction){
                    case 'halt': // (aka HLT)
                        programCounter -= 1;
                        isCycleExecute = 0;
                        break;
                    case 'load': // (aka LDA)
                        accumulator = currentValue;
                        break;
                    // case 'store': // (aka STA)
                    //     // can be implemented with additional ROMs to manage the clock and writing-data inputs of the memory banks
                    //     // To write it in this architecture: you need to simulate this program in Survivalcraft with a different programData array
                    //     // The current design has a lot of overlap in data as each combination of parameters has a state, it may be more efficient to split it up into aset of FSMs working together
                    //     isWriteMode = 1;
                    //     writeValue = accumulator;
                    //     break;
                    case 'add': // (aka ADD)
                        accumulator += currentValue;
                        break;
                    case 'subtract': // (aka SUB)
                        accumulator -= currentValue;
                        break;
                    case 'multiply':
                        accumulator *= currentValue;
                        break;
                    case 'divide':
                        accumulator /= currentValue;
                        break;
                    case 'and':
                        accumulator = accumulator & currentValue;
                        break;
                    case 'or':
                        accumulator = accumulator | currentValue;
                        break;
                    case 'xor':
                        accumulator = accumulator ^ currentValue;
                        break;
                    case 'not':
                        accumulator = ~currentValue;
                        break;
                    case 'bitshiftLeft':
                        accumulator = accumulator << currentValue;
                        break;
                    case 'bitshiftRight':
                        accumulator = accumulator >> currentValue;
                        break;
                    case 'branchIfNotZero':
                        if(accumulator != 0){
                            programCounter = addressRegister;
                        }
                        break;
                    case 'branchIfZero':
                        if(accumulator == 0){
                            programCounter = addressRegister;
                        }
                        break;
                    case 'branchIfZeroOrPositive':
                        if(accumulator >= 0){
                            programCounter = addressRegister;
                        }
                        break;
                    case 'branchIfNegative':
                        if(accumulator < 0){
                            programCounter = addressRegister;
                        }
                        break;
                    case 'branch':
                        programCounter = addressRegister;
                        break;
                }
            }
            return [programCounter, accumulator, addressRegister, instructionRegister, isCycleExecute];
        }
    )

    static selector = new Code(
        ([x], bankPosition) => {
            return [x == bankPosition ? 0xf : 0x0];
        }
    )

    static subSelector = new Code(
        ([x], bankPosition, [subValues] = [[0x3, 0xc]]) => {
            const isActive = Math.floor(x / subValues.length) == bankPosition;
            return [!isActive ? 0x0 : subValues[x % subValues.length]];
        }
    )

    static multiplexer = new Code(
        ([x, y], bankPosition) => {
            return [y == bankPosition ? x : 0x0];
        }
    )
}