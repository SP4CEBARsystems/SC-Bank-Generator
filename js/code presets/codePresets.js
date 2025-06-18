import CodePreset from "./CodePreset.js";
import standardCode from "./StandardCode.js";

/**
 * @type {CodePreset[]}
 */
export const codePresets = [
    new CodePreset(
        standardCode.addition,
        '4-bit Addition',
        'Adds two 4-bit numbers (unsigned integers) into a 5-bit number (unsigned integer).',
        'ROM',
        ['4', '4'],
        ['5'],
    ),
    new CodePreset(
        standardCode.subtraction,
        'Subtraction',
        'Subtracts one 4-bit number (unsigned integer) from another into a 5-bit signed number (2s-complement-signed integer).',
        'ROM',
        ['4', '4'],
        ['INT_5'],
    ),
    new CodePreset(
        standardCode.hexToDec,
        '8-bit Hexadecimal To 3-digit Decimal',
        'Converts an 8-bit number (unsigned integer) into a 3-digit decimal number, meaning three wires with signals ranging from 0 to 9 (instead of 0 to 15). This can be used to display an 8-bit value.',
        'ROM',
        ['8'],
        ['4', '4', '4'],
    ),
    new CodePreset(
        standardCode.decToHex,
        '3-digit Decimal Input To 8-bit Hexadecimal',
        'Converts a 3-digit decimal number, meaning three wires with signals ranging from 0 to 9 (instead of 0 to 15) into an 8-bit number (unsigned integer). (This preset was requested by Symbadx37)',
        'ROM',
        ['4', '4', '4'],
        ['8'],
    ),
    new CodePreset(
        standardCode.typeConverter,
        "Sign-magnitude Integer To Two's Complement Integer",
        "Converts an 8-bit signed number from the sign-magnitude integer format (similar to how we, humans, write negative numbers) to the two's complement integer format (efficient and convenient, it is used a lot here). This is useful for inputing negative numbers into your system",
        'ROM',
        ['SM_INT_8'],
        ['INT_8'],
    ),
    new CodePreset(
        standardCode.typeConverter,
        "Two's Complement Integer To Sign-magnitude Integer",
        "Converts an 8-bit signed number from the two's complement integer format (efficient and convenient, it is used a lot here) to the sign-magnitude integer format (similar to how we, humans, write negative numbers). This is useful for outputing and displaying negative numbers from your system",
        'ROM',
        ['INT_8'],
        ['SM_INT_8'],
    ),
    new CodePreset(
        standardCode.bitMask,
        '4-bit Mask',
        'Applies a 4-bit bitmask on a 4-bit number (unsigned integer)',
        'ROM',
        ['4'],
        ['4'],
        [0, 0, 0b1111],
    ),
    new CodePreset(
        standardCode.bitMaskAndShift,
        '4-bit Mask And Shift Left 1',
        'Applies a single bit shift left on a 4-bit number (unsigned integer)',
        'ROM',
        ['4'],
        ['8'],
        [1, 0, 0b1111],
    ),
    new CodePreset(
        standardCode.bitMaskAndShift,
        '4-bit Mask And Shift Right 1',
        'Applies a single bit shift right on a 4-bit number (unsigned integer)',
        'ROM',
        ['4'],
        ['8'],
        [4, 1, 0b1111],
    ),
    new CodePreset(
        standardCode.selector,
        '4-bit Selector',
        'Turns on (outputs value 15) when the 4-bit input matches the location index of this memory bank. Outputs zero otherwise.',
        'Selector ROM',
        ['4'],
        ['4'],
        [],
        16,
    ),
    new CodePreset(
        standardCode.selector,
        '8-bit Selector',
        'Turns on (outputs value 15) when the 8-bit input matches the location index of this memory bank. Outputs zero otherwise.',
        'Selector ROM',
        ['8'],
        ['4'],
        [],
        256,
    ),
    new CodePreset(
        standardCode.subSelector,
        'Horizontal Segment AND-grid Driver For 4-LED Plotters',
        'Outputs one of two horizontal 4-LED segments (outputs either 3 (1100) or 12 (0011)) when the 4-bit input matches the location index of this memory bank. Outputs zero otherwise. This is mostly useful for high resolution pixel plotters.',
        'Selector ROM',
        ['4'],
        ['4'],
        [[0x3, 0xc]],
        16,
    ),
    new CodePreset(
        standardCode.subSelector,
        'Vertical Segment AND-grid Driver For 4-LED Plotters',
        'Outputs one of two vertical 4-LED segments (outputs either 5 (1010) or 10 (0101)) when the 4-bit input matches the location index of this memory bank. Outputs zero otherwise. This is mostly useful for high resolution pixel plotters.',
        'Selector ROM',
        ['4'],
        ['4'],
        [[0x5, 0xa]],
        16,
    ),
    new CodePreset(
        standardCode.multiplexer,
        '4-bit Multiplexer',
        'Enables a 4-bit (unsigned integer) input when another 4-bit input matches the location index of this memory bank',
        'Selector ROM',
        ['4', '4'],
        ['4'],
        [],
        16,
    ),
    new CodePreset(
        standardCode.incrementCounterFsm,
        '8-bit Increment-only Counter FSM',
        `An 8-bit (unsigned integer) counter that counts up on each cycle and resets on the maximum value (aka "FF", "1111 1111"). Trigger the memory bank clock inputs to increment. Send the maximum signal (aka "F", "1.5v", "1111") to both input wires to reset it.`,
        'FSM',
        ['8'],
        ['8'],
    ),
    new CodePreset(
        standardCode.counterFsm,
        '4-bit Counter FSM With Overflow',
        `This counter can count both up and down with a range between 0 and 15, when a range boundary is exceeded it overflows to the other boundary. Inputs: keep, reset, increment, decrement`,
        'FSM',
        ['4, 1, 1'],
        ['4'],
        [0, 15, 1],
    ),
    new CodePreset(
        standardCode.counterFsm,
        '4-bit Counter FSM Without Overflow',
        `This counter can count both up and down with a range between 0 and 15, when a range boundary is exceeded the number stops counting (it reached the end). Inputs: keep, reset, increment, decrement`,
        'FSM',
        ['4, 1, 1'],
        ['4'],
        [0, 15, 0],
    ),
    new CodePreset(
        standardCode.counterFsm,
        '6-bit Counter FSM With Overflow',
        `This counter can count both up and down with a range between 0 and 63, when a range boundary is exceeded it overflows to the other boundary. Inputs: keep, reset, increment, decrement`,
        'FSM',
        ['6, 1, 1'],
        ['6'],
        [0, 63, 1],
    ),
    new CodePreset(
        standardCode.counterFsm,
        '6-bit Counter FSM Without Overflow',
        `This counter can count both up and down with a range between 0 and 63, when a range boundary is exceeded the number stops counting (it reached the end). Inputs: keep, reset, increment, decrement`,
        'FSM',
        ['6, 1, 1'],
        ['6'],
        [0, 63, 0],
    ),
    new CodePreset(
        standardCode.bouncyCounterFsm,
        '6-bit Bouncy Counter FSM',
        `This counter changes counting direction instead of overflowing`,
        'FSM',
        ['6', '1', '1'],
        ['6', '1'],
    ),
    new CodePreset(
        standardCode.shiftRegisterFsm,
        '8-bit Shift Register FSM',
        `This FSM shifts all bits left two times each cycle, so it acts as a shift register to 2-bit (unsigned integer) words and it can store four of them.`,
        'FSM',
        ['8'],
        ['8'],
    ),
    // new CodePreset(
    //     standardCode.shiftRegisterFsm2,
    //     '8-bit Shift Register FSM',
    //     '',
    //     'FSM',
    //     ['2', '2', '2', '2'],
    //     ['2', '2', '2', '2'],
    // ),
    new CodePreset(
        standardCode.cpuFsm,
        '2-bit CPU FSM',
        `A CPU inside an FSM which can only deal with 2-bit (unsigned integer) values. It has the instructions: halt, load, subtract, branch if not zero. It is comes with a program to decrement until zero is reached. Given the small instruction set (2-bit gives only four different instructions) you should adjust this set per program, the following instructions are available to add to your instruction set: halt, load, add, subtract, multiply, divide, and, or, xor, not, bitshiftLeft, bitshiftRight, branchIfNotZero, branchIfZero, branchIfZeroOrPositive, branchIfNegative, and branch. This is inspired by The Little Man Computer (Online Demo)`,
        'FSM',
        ['2', '2', '2', '2', '1'],
        ['2', '2', '2', '2', '1'],
    ),
    new CodePreset(
        standardCode.cpuFsm,
        '3-bit CPU FSM - calculates 3 % 2',
        `Warning: generating this may crash this page, it will take around 15 seconds to generate otherwise as it generates 128 Banks. A CPU inside an FSM which can only deal with 3-bit (2s-complement-signed integer) values. It has the instructions: halt, load, subtract, branchIfZeroOrPositive, add. It is comes with a program to integer-divide 3-bit 2s-complement-signed numbers. Given the small instruction set (3-bit gives only eight different instructions) you should adjust this set per program, the following instructions are available to add to your instruction set: halt, load, add, subtract, multiply, divide, and, or, xor, not, bitshiftLeft, bitshiftRight, branchIfNotZero, branchIfZero, branchIfZeroOrPositive, branchIfNegative, and branch. This is inspired by The Little Man Computer (Online Demo)`,
        'FSM',
        ['3', 'U_INT_3', '3', '3', '1'],
        ['3', 'U_INT_3', '3', '3', '1'],
        [
            [
                'halt', 'load', 'subtract', 'branchIfZeroOrPositive', 'add', 'halt', 'halt', 'halt'
            ],
            [
                { instruction: 1, address: 0 }, // 0: load dividend
                { instruction: 2, address: 1 }, // 1: subtract divisor
                { instruction: 3, address: 1 }, // 2: if >= 0, repeat subtraction
                { instruction: 4, address: 1 }, // 3: else add divisor back to fix negative
                { instruction: 0, address: 0 }, // 4: halt
                { instruction: 0, address: 0 }, // 5: unused
                { instruction: 0, address: 0 }, // 6: unused
                { instruction: 0, address: 0 }  // 7: unused
            ],
            [
                3, // 0: dividend
                2,  // 1: divisor
                0,  // 2: unused
                0,  // 3: unused
                0,  // 4: unused
                0,  // 5: unused
                0,  // 6: unused
                0   // 7: unused
            ]
        ]
    ),
];