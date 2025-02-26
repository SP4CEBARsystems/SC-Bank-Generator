import CodePreset from "./CodePreset.js";
import standardCode from "./StandardCode.js";

/**
 * @type {CodePreset[]}
 */
export const codePresets = [
    new CodePreset(
        'addition',
        standardCode.addition
    ),
    new CodePreset(
        'manualSubtraction',
        standardCode.manualSubtraction
    ),
    new CodePreset(
        'subtraction',
        standardCode.subtraction
    ),
    new CodePreset(
        'hexToDec',
        standardCode.hexToDec
    ),
    new CodePreset(
        'decToHex',
        standardCode.decToHex
    ),
    new CodePreset(
        'typeConverter',
        standardCode.typeConverter
    ),
    new CodePreset(
        'bitMaskAndShift',
        standardCode.bitMaskAndShift
    ),
    new CodePreset(
        'counterFsm',
        standardCode.counterFsm
    ),
    new CodePreset(
        'bouncyCounterFsm',
        standardCode.bouncyCounterFsm
    ),
    new CodePreset(
        'cpuFsm',
        standardCode.cpuFsm
    ),
    new CodePreset(
        'selector',
        standardCode.selector
    ),
    new CodePreset(
        'subSelector',
        standardCode.subSelector
    ),
    new CodePreset(
        'multiplexer',
        standardCode.multiplexer
    ),
];