import { initConsoleListener, runUserFunction } from "./code_sandbox.js";
import { newCodeBlock, newContainer, newSVGImage, newSVGText } from "./dom_manipulator.js";
import ExtendedMath from "./extended_math.js";
import TypeValue from "./type_value.js";
import Word from "./word.js";

export default class MemoryBankGenerator {
    numberOfLocations;

    inputTypes;

    outputTypes;

    // generatorCallback;

    /**
     * @type {string[][]}
     */
    generatedData = [];
    
    // * @param {(bankIndex:number[], bankPosition?:number) => number[]} generatorCallback 
    /**
     * 
     * @param {number} numberOfLocations 
     * @param {string[]} inputTypes
     * @param {string[]} outputTypes
     */
    constructor(numberOfLocations = 1, inputTypes = [], outputTypes = []) {
        this.numberOfLocations = numberOfLocations;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        // this.generatorCallback = generatorCallback;
        initConsoleListener(this.processOutput.bind(this));
    }

    init(numberOfLocations = 1, inputTypes, outputTypes){
        this.numberOfLocations = numberOfLocations;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        // this.generatorCallback = generatorCallback;
    }

    generate(){
        const bankInput = [];
        for (let bankPosition = 0; bankPosition < this.numberOfLocations; bankPosition++) {
            bankInput.push(this.sampleBankInput(bankPosition));
            // const bankData = ExtendedMath.sample(
                //     256, this.callbackHost, bankPosition, this.inputTypes, this.outputTypes, this.generatorCallback
                // );
        }
        console.log('bankInput', bankInput);
        runUserFunction(bankInput);
    }

    processOutput(data){
        console.log("processOutput", data);
        const bankArrayData = [];
        data.forEach(element => {
            const processed = element.map(subElement => {
                return this.unformatOutput(this.outputTypes, subElement);
            })
            console.log('processed', processed);
            bankArrayData.push(this.postProcessOne(processed));
        });
        console.log('bankArrayData', bankArrayData);
        this.generatedData = bankArrayData;
        this.write();
    }

    /**
     * 
     * @param {any[]} bankData 
     * @returns {string[]}
     */
    postProcessOne(bankData) {
        const arrayLength = this.countMemoryBanksRequired(bankData);
        if (isNaN(arrayLength)) {
            const faultyIndex = bankData.findIndex((element) => isNaN(element));
            if (faultyIndex != -1) {
                console.error('invalid parameter(s) found, these are the values that your code produced:', bankData[faultyIndex], 'on index', faultyIndex, 'in', bankData);
            } else {
                console.error('invalid parameter(s) found, none of your values are NaN:', bankData);
            }
            return [];
        }
        const bankDataStrings = new Array(arrayLength).fill("");
        for (const bankValue of bankData) {
            for (const digitIndex in bankDataStrings) {
                bankDataStrings[digitIndex] += ExtendedMath.getHexDigit(bankValue, digitIndex);
            }
        }
        return bankDataStrings
    }

    // sampleBank(bankPosition) {
    //     const data = [];
    //     for (let index = 0; index < 256; index++) {
    //         data.push(this.callbackHost(index, bankPosition, this.inputTypes, this.outputTypes, this.generatorCallback));
    //     }
    //     return data;
    // }

    sampleBankInput(bankPosition) {
        const data = [];
        for (let index = 0; index < 256; index++) {
            data.push([this.formatInput(index, this.inputTypes), bankPosition]);
        }
        // const output = this.generatorCallback(parameters, bankPosition);
        return data;
    }

    /**
     * 
     * @param {number} bankIndex 
     * @param {number} bankPosition 
     * @param {string[]} inputTypes 
     * @param {string[]} outputTypes 
     * @param {(bankIndex:number[], bankPosition:number) => number[]} callback 
     * @returns {number}
     */
    callbackHost(bankIndex, bankPosition, inputTypes, outputTypes, callback){
        let parameters = this.formatInput(inputTypes, bankIndex);
        // runUserFunction(inputArray);
        const output = callback(parameters, bankPosition);
        return this.unformatOutput(outputTypes, output);
    }

    formatInput(bankIndex, inputTypes) {
        const inputSizes = inputTypes.map(TypeValue.sizeOf);
        const rawParameters = ExtendedMath.wordSplit(bankIndex, inputSizes);
        return TypeValue.arrayFromValues(inputTypes, rawParameters).map(element => element.outputValue());
    }

    unformatOutput(outputTypes, output) {
        const outputSizes = outputTypes.map(TypeValue.sizeOf);
        if (output.length != outputSizes.length) {
            console.error('outputSizes count mismatch, you have', output.length, 'outputs but you have defined', outputSizes.length, 'output lengths');
            return 0;
        }
        const encodedOutput = TypeValue.arrayFromValues(outputTypes, output).map(element => element.value);
        const out = ExtendedMath.combineOutput(encodedOutput.map((value, index) => new Word(outputSizes[index], value)));
        return out;
    }

    /**
     * 
     * @param {number[]} bankData 
     * @returns 
     */
    countMemoryBanksRequired(bankData) {
        const biggestValue = Math.max(...bankData);
        return Math.ceil(ExtendedMath.getBaseLog(16, biggestValue + 1));
    }

    /**
     * 
     * @returns {string[][]}
     */
    getFormattedData(){
        return this.generatedData
            .map(element => element
                .map(element => insertNewlines(element)));

        /**
         * generated by ChatGPT
         * @param {string} str 
         * @param {number} interval 
         * @returns 
         */
        function insertNewlines(str, interval = 16) {
            return str.replace(new RegExp(`(.{${interval}})(?=.)`, 'g'), '$1\n');
        }
    }

    write() {
        this.getFormattedData().forEach((elementY, indexY) => {
            if (elementY.length == 0) {
                newCodeBlock(`Bank ${indexY}, obsolete`, '');
            } else {
                elementY.forEach((element, index) => 
                    newCodeBlock(`Bank ${indexY}, digit ${index}:`, element)
                )
            }
        })
        this.generateCircuit();
    }

    clear(){
        this.generatedData = [];
        const banks = document.getElementById('bank-data-output');
        if (banks) {
            banks.innerHTML = "";
        }
        const circuit = document.getElementById('reference-circuit');
        if (circuit) {
            circuit.innerHTML = "";
        }
    }

    getWidth(imageName){
        switch (imageName) {
            case 'bank_empty.jpg':
            case 'bank_wires.jpg':
            case 'bank_wires_crossing.jpg':
            case 'bank_digit.jpg':
            case 'bank_digit_single.jpg':
            case 'bank_selector_8-bit.jpg':
                return 212;
            default:
                return 127;
        }
    }

    /**
     * 
     * @returns 
     */
    generateCircuit(){
        /**
         * 
         * @param {string} element 
         * @param {number} currentX 
         * @param {number} digitYOffset 
         * @param {number} height 
         * @param {*} parent 
         * @param {number} svgWidth 
         * @param {string=} nameText
         * @returns 
         */
        const drawCircuitCell = (element, currentX, digitYOffset, height, parent, svgWidth, nameText) => {
            const width = this.getWidth(element);
            newSVGImage(currentX, digitYOffset, width, height, element, parent);
            if(nameText !== undefined) newSVGText(currentX, digitYOffset, nameText, parent);
            currentX += width;
            svgWidth += width;
            return [currentX, svgWidth];
        }
        const parent = /** @type {SVGElement} */ document.getElementById('reference-circuit');
        if (parent === null) return;
        const sum = (accumulator, value) => accumulator + value;
        const totalInputSize = this.inputTypes.map(TypeValue.sizeOf).reduce(sum);
        const inputWireCount = Math.ceil(totalInputSize / 4);
        const outputWireCount = Math.ceil(this.outputTypes.map(TypeValue.sizeOf).reduce(sum) / 4);
        let process;
        if (inputWireCount <= 0) {
            process = [];
        } else if (inputWireCount <= 1) {
            process = ['bank_digit_single.jpg'];
        } else if (inputWireCount <= 2) {
            process = ['bank_digit.jpg'];
        } else if (inputWireCount <= 3) {
            process = ['bank_digit.jpg', 'bank_selector_4-bit.jpg'];
        } else {
            const amountOfSelectors = Math.ceil((inputWireCount - 2) / 2);
            process = ['bank_digit.jpg', ...Array(amountOfSelectors).fill('bank_selector_8-bit.jpg')];
        }
        let svgWidth = 0;
        let svgHeight = 0;
        const SingleBankInputSize = 8;
        const inputLayerCount = 2 ** Math.ceil(Math.max(0, totalInputSize - SingleBankInputSize));
        for (let location = 0; location < this.numberOfLocations; location++) {
            for (let input = 0; input < inputLayerCount; input++) {
                for (let digit = 0; digit < outputWireCount; digit++) {
                    const height = 127;
                    const digitYOffset = ((location * inputLayerCount + input) * outputWireCount + digit) * height;
                    let currentX = 0;
                    let svgRowWidth = 0;
                    process.forEach((element, index) => {
                        let bankName;
                        switch (element) {
                            case 'bank_digit.jpg':
                            case 'bank_digit_single.jpg':
                                bankName = `Bank L${location}-I${input}-D${digit}`;
                                break;
                            case 'bank_selector_4-bit.jpg':
                            case 'bank_selector_8-bit.jpg':
                                bankName = `Input Selector ${input}`;
                                break;
                            default:
                                bankName = undefined
                                break;
                        }
                        [currentX, svgRowWidth] = drawCircuitCell(element, currentX, digitYOffset, height, parent, svgRowWidth, bankName);
                    });
                    let hasConnected = false;
                    for (let digitOut = 0; digitOut < outputWireCount; digitOut++) {
                        const isConnecting = digit === digitOut;
                        if (isConnecting) hasConnected = true;
                        const element = isConnecting ? 'output_collector.jpg' : !hasConnected ? 'output_crossing.jpg' : 'output_vertical.jpg';
                        [currentX, svgRowWidth] = drawCircuitCell(element, currentX, digitYOffset, height, parent, svgRowWidth);
                    }
                    svgWidth = Math.max(svgWidth, svgRowWidth);
                    svgHeight += height;
                }
            }
        }
        parent.setAttribute("width", `${svgWidth}px`);
        parent.setAttribute("height", `${svgHeight}px`);
        // parent.setHeight(5000);
        console.log(`total banks ${this.numberOfLocations * inputLayerCount * outputWireCount} = count (${this.numberOfLocations}) * input requirement (${inputLayerCount}) * digits (${outputWireCount})`);
    }

    getStats() {
        return '';
        // `${this.numberOfLocations} * ${inputLayerCount} * ${outputWireCount}`
    }
}
