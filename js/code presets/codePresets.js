import CodePreset from "./CodePreset.js";
import standardCode from "./StandardCode.js";

/**
 * @type {CodePreset[]}
 */
export const generatorPresets = [
    new CodePreset(
        'addition',
        standardCode.addition,
    ),
    new CodePreset(
        'subtraction',
        standardCode.subtraction
    ),
    new CodePreset(
        'FSM',
        standardCode.FSM
    ),
    new CodePreset(
        'display',
        standardCode.display
    ),
    new CodePreset(
        'highResDisplay',
        standardCode.highResDisplay
    )
];