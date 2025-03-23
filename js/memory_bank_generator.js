import { initConsoleListener, runUserFunction } from "./code_sandbox.js";
import DataType from "./data_type.js";
import { newCodeBlock, newContainer, newElement, newSVGImage, newSVGText, newTableRow } from "./dom_manipulator.js";
import ElapsedTimer from "./ElapsedTimer.js";
import ExtendedMath from "./extended_math.js";
import NamedVector from "./named_vector.js";
import TypeValue from "./type_value.js";
import Word from "./word.js";

export default class MemoryBankGenerator {
    numberOfLocations;

    inputTypes;

    outputTypes;

    // generatorCallback;

    /**
     * @type {string[][][]}
     */
    generatedData = [];

    elapsedTimer;
    
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
        this.elapsedTimer = new ElapsedTimer('elapsed-time-display');
    }

    init(numberOfLocations = 1, inputTypes, outputTypes){
        this.numberOfLocations = numberOfLocations;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        // this.generatorCallback = generatorCallback;
    }

    generate(){
        initConsoleListener().then(this.processOutput.bind(this));
        const bankInput = [];
        for (let bankPosition = 0; bankPosition < this.numberOfLocations; bankPosition++) {
            bankInput.push(this.sampleBankInput(bankPosition));
            // const bankData = ExtendedMath.sample(
                //     256, this.callbackHost, bankPosition, this.inputTypes, this.outputTypes, this.generatorCallback
                // );
        }
        console.log('bankInput', bankInput);
        this.elapsedTimer.start();
        runUserFunction(bankInput);
    }

    processOutput(data){
        this.elapsedTimer.stop();
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
     * @returns {string[][]}
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
        // this.inputTypes.map(TypeValue.sizeOf);
        // const inputSize = this.getTotalInputSize()
        // const inputBanks = inputSize - 8;

        const inputSeparatedBankData = this.splitIntoChunks(bankData)
        console.log('inputSeparatedBankData', inputSeparatedBankData);
        const bankDataStrings = inputSeparatedBankData.map((element)=>this.dataToArray(arrayLength, element));
        console.log('bankDataStrings', bankDataStrings);
        return bankDataStrings;
    }

    /**
     * by ChatGPT
     * @param {*} arr 
     * @param {*} chunkSize 
     * @returns 
     */
    splitIntoChunks(arr, chunkSize = 256) {
        let result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize));
        }
        return result;
    }

    dataToArray(arrayLength, bankData) {
        const bankDataStrings = new Array(arrayLength).fill("");
        for (const bankValue of bankData) {
            for (const digitIndex in bankDataStrings) {
                bankDataStrings[digitIndex] += ExtendedMath.getHexDigit(bankValue, digitIndex);
            }
        }
        for (const digitIndex in bankDataStrings) {
            const memoryBankInputSize = 256;
            const memoryBankDefaultValue = "0";
            bankDataStrings[digitIndex].padEnd(memoryBankInputSize, memoryBankDefaultValue);
        }
        return bankDataStrings;
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
        const inputBitSize = this.getTotalInputSize();
        const inputSize = 2 ** inputBitSize;
        console.log('inputSize', inputSize);
        for (let index = 0; index < inputSize; index++) {
            data.push([this.formatInput(index, this.inputTypes), bankPosition]);
        }
        // const output = this.generatorCallback(parameters, bankPosition);
        return data;
    }

    getTotalInputSize() {
        return this.inputTypes.reduce((previous, element) => previous + TypeValue.sizeOf(element), 0);
    }

    // /**
    //  * 
    //  * @param {number} bankIndex 
    //  * @param {number} bankPosition 
    //  * @param {string[]} inputTypes 
    //  * @param {string[]} outputTypes 
    //  * @param {(bankIndex:number[], bankPosition:number) => number[]} callback 
    //  * @returns {number}
    //  */
    // callbackHost(bankIndex, bankPosition, inputTypes, outputTypes, callback){
    //     let parameters = this.formatInput(inputTypes, bankIndex);
    //     // runUserFunction(inputArray);
    //     const output = callback(parameters, bankPosition);
    //     return this.unformatOutput(outputTypes, output);
    // }

    /**
     * Cuts the input value up into the multiple function parameters according to each input's size
     * @param {number} bankIndex 
     * @param {string[]} inputTypes 
     * @returns {number[]}
     */
    formatInput(bankIndex, inputTypes) {
        const inputSizes = inputTypes.map(TypeValue.sizeOf);
        const rawParameters = ExtendedMath.wordSplit(bankIndex, inputSizes);
        return TypeValue.arrayFromValues(inputTypes, rawParameters, true).map(element => element.outputValue());
    }

    /**
     * 
     * @param {*} outputTypes 
     * @param {*} output 
     * @returns 
     */
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
     * @returns {string[][][]}
     */
    getFormattedData(){
        return this.generatedData
            .map(element => element
                .map(element => element
                .map(element => insertNewlines(element))));

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
        console.log('write', this.getFormattedData());
        this.getFormattedData().forEach((dataAtPosition, positionIndex) => {
            dataAtPosition.forEach((dataAtInputLayer, inputIndex) => {
                if (dataAtInputLayer.length == 0) {
                    newCodeBlock(`Bank ${positionIndex}, obsolete`, '');
                } else {
                    dataAtInputLayer.forEach((dataAtDigit, digitIndex) => 
                        newCodeBlock(`${this.generateBankName(positionIndex, inputIndex, digitIndex)}`, dataAtDigit)
                    )
                }
            })
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
     * @param {string} element 
     * @param {number} currentX 
     * @param {number} digitYOffset 
     * @param {number} height 
     * @param {*} parent 
     * @param {number} svgWidth 
     * @param {NamedVector[]} nameTexts
     * @returns 
     */
    drawCircuitCell(element, currentX, digitYOffset, height, parent, svgWidth, nameTexts = []) {
        const width = this.getWidth(element);
        newSVGImage(currentX, digitYOffset, width, height, element, parent);
        nameTexts.forEach(nameText => newSVGText(currentX + nameText.x, digitYOffset + nameText.y, nameText.name, parent));
        currentX += width;
        svgWidth += width;
        return [currentX, svgWidth];
    }

    /**
     * 
     * @returns 
     */
    generateCircuit(){
        const parent = /** @type {SVGElement} */ document.getElementById('reference-circuit');
        if (parent === null) return;
        const sum = (accumulator, value) => accumulator + value;
        const totalInputSize = this.inputTypes.map(TypeValue.sizeOf).reduce(sum);
        const inputWireCount = Math.ceil(totalInputSize / 4);
        const outputWireCount = Math.ceil(this.outputTypes.map(TypeValue.sizeOf).reduce(sum) / 4);
        const process = this.createCircuitTemplate(inputWireCount);
        let svgWidth = 0;
        let svgHeight = 0;
        const SingleBankInputSize = 8;
        const inputLayerCount = 2 ** Math.ceil(Math.max(0, totalInputSize - SingleBankInputSize));
        const height = 127;
        ({ svgWidth, svgHeight } = this.generateEmptyWire(process, height, parent, outputWireCount, svgWidth, svgHeight));
        for (let location = 0; location < this.numberOfLocations; location++) {
            for (let input = 0; input < inputLayerCount; input++) {
                for (let digit = 0; digit < outputWireCount; digit++) {
                    ({ svgWidth, svgHeight } = this.generateCircuitRow(location, inputLayerCount, input, outputWireCount, digit, height, process, parent, svgWidth, svgHeight));
                }
            }
        }
        parent.setAttribute("width", `${svgWidth}px`);
        parent.setAttribute("height", `${svgHeight}px`);
        this.generateBankCountDisplay(inputLayerCount, outputWireCount);
        this.generateTypeTableDisplay(this.inputTypes, 'bank-input-type-table', 'I');
        this.generateTypeTableDisplay(this.outputTypes, 'bank-output-type-table', 'O');

        // console.log(bankCountMessage);
    }

    generateCircuitRow(location, inputLayerCount, input, outputWireCount, digit, height, process, parent, svgWidth, svgHeight) {
        const emptyWireOffset = 1;
        const digitYOffset = ((location * inputLayerCount + input) * outputWireCount + digit + emptyWireOffset) * height;
        let currentX = 0;
        let svgRowWidth = 0;
        [currentX, svgRowWidth] = this.generateRomCircuitPart(process, input, location, digit, currentX, svgRowWidth, digitYOffset, height, parent);
        [currentX, svgRowWidth] = this.generateOutputRoutingCircuitPart(outputWireCount, digit, input, location, currentX, svgRowWidth, digitYOffset, height, parent);
        svgWidth = Math.max(svgWidth, svgRowWidth);
        svgHeight += height;
        return { svgWidth, svgHeight };
    }

    generateEmptyWire(process, height, parent, outputWireCount, svgWidth, svgHeight) {
        let currentX = 0;
        let svgRowWidth = 0;
        [currentX, svgRowWidth] = this.generateEmptyCircuitRow(process, currentX, svgRowWidth, 0, height, parent);
        [currentX, svgRowWidth] = this.generateEmptyOutputRoutingCircuitPart(outputWireCount, currentX, svgRowWidth, 0, height, parent);
        svgWidth = Math.max(svgWidth, svgRowWidth);
        svgHeight += height;
        return { svgWidth, svgHeight };
    }

    createCircuitTemplate(inputWireCount) {
        const process = [];
        if (inputWireCount <= 0) {
        } else if (inputWireCount <= 1) {
            process.push('bank_digit_single.jpg');
        } else if (inputWireCount <= 2) {
            process.push('bank_digit.jpg');
        } else {
            const additionalInputWireCount = inputWireCount - 2;
            const amountOfSelectors = Math.floor(additionalInputWireCount / 2);
            const hasUnevenInputWireCount = additionalInputWireCount % 2 != 0;
            process.push('bank_digit.jpg', ...Array(amountOfSelectors).fill('bank_selector_8-bit.jpg'));
            if (hasUnevenInputWireCount) {
                process.push('bank_selector_4-bit.jpg');
            }
        }
        return process;
    }

    generateEmptyCircuitRow(process, currentX, svgRowWidth, digitYOffset, height, parent) {
        let wireIndex = 0;
        process.forEach((element) => {
            let wireElement;
            const wireNames = [];
            switch (element) {
                case 'bank_digit_single.jpg':
                    wireElement = 'bank_wire.jpg';
                    wireNames.push(new NamedVector(`I${wireIndex++}`, 70));
                case 'bank_digit.jpg':
                case 'bank_selector_8-bit.jpg':
                    wireElement = 'bank_wires.jpg';
                    wireNames.push(new NamedVector(`I${wireIndex++}`, 70), new NamedVector(`I${wireIndex++}`, 150));
                    break;
                case 'bank_selector_4-bit.jpg':
                    wireElement = `input_vertical.jpg`;
                    wireNames.push(new NamedVector(`I${wireIndex++}`, 70));
                    break;
                default:
                    wireElement = 'fsm_empty.jpg'
                    break;
            }
            [currentX, svgRowWidth] = this.drawCircuitCell(wireElement, currentX, digitYOffset, height, parent, svgRowWidth, wireNames);
        });
        return [currentX, svgRowWidth];
    }

    generateRomCircuitPart(process, input, location, digit, currentX, svgRowWidth, digitYOffset, height, parent) {
        let additionalInputWireIndex = 0;
        process.forEach((element) => {
            const selectorLocation = Math.floor((input / 256 ** additionalInputWireIndex) % 256);
            let bankNames = [];
            switch (element) {
                case 'bank_digit.jpg':
                case 'bank_digit_single.jpg':
                    bankNames.push(new NamedVector(this.generateBankName(location, input, digit)));
                    break;
                case 'bank_selector_4-bit.jpg':
                    bankNames.push(new NamedVector(`4-bit Multiplexer L${selectorLocation}`));
                    additionalInputWireIndex++;
                    break;
                case 'bank_selector_8-bit.jpg':
                    bankNames.push(new NamedVector(`8-bit Selector L${selectorLocation}`));
                    additionalInputWireIndex++;
                    break;
                default:
                    break;
            }
            [currentX, svgRowWidth] = this.drawCircuitCell(element, currentX, digitYOffset, height, parent, svgRowWidth, bankNames);
        });
        return [currentX, svgRowWidth];
    }

    generateEmptyOutputRoutingCircuitPart(outputWireCount, currentX, svgRowWidth, digitYOffset, height, parent) {
        for (let digitOut = 0; digitOut < outputWireCount; digitOut++) {
            const element = 'output_vertical.jpg';
            const wireNames = [new NamedVector(`O${digitOut}`, 70)];
            [currentX, svgRowWidth] = this.drawCircuitCell(element, currentX, digitYOffset, height, parent, svgRowWidth, wireNames);
        }
        return [currentX, svgRowWidth];
    }

    generateOutputRoutingCircuitPart(outputWireCount, digit, input, location, currentX, svgRowWidth, digitYOffset, height, parent) {
        let hasConnected = false;
        for (let digitOut = 0; digitOut < outputWireCount; digitOut++) {
            const isConnecting = digit === digitOut;
            if (isConnecting) hasConnected = true;
            const isFirstElementOfNonFirstLocation = (input == 0 && digit == 0) && location != 0;
            const element = isFirstElementOfNonFirstLocation ? (
                isConnecting ? 'output_capped_collector.jpg' : !hasConnected ? 'output_horizontal.jpg' : 'output_capped_vertical.jpg'
            ) : (
                isConnecting ? 'output_collector.jpg' : !hasConnected ? 'output_crossing.jpg' : 'output_vertical.jpg'
            );
            [currentX, svgRowWidth] = this.drawCircuitCell(element, currentX, digitYOffset, height, parent, svgRowWidth);
        }
        return [currentX, svgRowWidth];
    }

    generateBankCountDisplay(inputLayerCount, outputWireCount) {
        const totalBanks = this.numberOfLocations * inputLayerCount * outputWireCount;
        // parent.setHeight(5000);
        const bankCountMessage = `Generated ${totalBanks} banks: (${ExtendedMath.pluralFixedPhrase(this.numberOfLocations, 'location', 'locations')}) * (${ExtendedMath.pluralFixedPhrase(inputLayerCount, 'input', 'inputs')}) * (${ExtendedMath.pluralFixedPhrase(outputWireCount, 'digit', 'digits')})`;
        const bankCountElement = document.getElementById('bank-count-display');
        if (bankCountElement) {
            bankCountElement.textContent = bankCountMessage;
        }
    }

    /**
     * 
     * @param {string[]} types 
     * @param {string} elementId 
     * @param {string} wireNamePrefix 
     * @returns 
     */
    generateTypeTableDisplay(types, elementId, wireNamePrefix = ''){
        const TypeTableElement = document.getElementById(elementId);
        if (!TypeTableElement) return;
        TypeTableElement.innerHTML = '';
        const encodedTypes = types.map(type => new DataType(type));
        const sizes = encodedTypes.map(type => type.getSize());
        const totalSize = sizes.reduce((acc, num) => acc + num, 0);

        const tableRoot = newContainer('table', 'data-type-table', TypeTableElement);
        newTableRow(tableRoot, [
            'parameter',
            'parameter type',
            'wire',
            'bit',
            'function',
            'magnitude',
        ], 'tableHeader', true);
        for (let index = 0, dataTypeOffset = 0, typeIndex = 0, segmentOffset = 0, segmentIndex = 0; index < totalSize; index++, dataTypeOffset++, segmentOffset++) {
            if (dataTypeOffset >= sizes[typeIndex]){
                dataTypeOffset = 0;
                segmentIndex = 0;
                segmentOffset = 0;
                typeIndex++;
            }
            const currentDataType = encodedTypes[typeIndex];
            const segments = currentDataType.getSegments();
            if (dataTypeOffset >= segments[segmentIndex].exponent + segments[segmentIndex].size) {
                segmentOffset = 0;
                segmentIndex++;
            }
            const currectSection = segments[segmentIndex];
            const isFirstBitParameter = dataTypeOffset === 0;
            const rowCells = newTableRow(tableRoot, [
                isFirstBitParameter ? `${typeIndex}` : '',
                isFirstBitParameter ? `${currentDataType.getFullNameWithSize()}` : '',
                `${wireNamePrefix}${Math.floor(index / 4)}`,
                `${index}`,
                currectSection.name,
                `${2**segmentOffset}`,
            ], `row${index}${isFirstBitParameter ? ' new-table-section' : ''}`, false, true);
            // if (index % 4 === 0) {
            //     // rowCells[0].classlist.add('');
            //     // rowCells[0].rowSpan = 4;
            // }
        }

        // const columnCount = 5;
        // const collumnElements = Array.from({ length: columnCount }, () => newContainer('tr', '', tableRoot));
        // ['Input Types', 'Output Types'].map(text => newElement('th', text, '', collumnElements[0]));
        // types.map(type => newElement('td', type.getFullName(), '', collumnElements[1]));
        // types.map(type => newElement('td', type.getSize(), '', collumnElements[2]));

        // const tableData = [
        //     [['input types', 4], ['output types', 2]],
        //     [...(inputTypes.map(['input types', 4])), ['output types', 2]],
        // ]
        // const table = {
        //     inputTypes: inputTypes.map(type => type.getSize()),
        //     outputTypes: outputTypes.map(type => type.getSize()),
        // }
    }
    
    generateBankName(location, input, digit) {
        return `Bank L${location}-I${input}-D${digit}`;
    }

    getStats() {
        return '';
        // `${this.numberOfLocations} * ${inputLayerCount} * ${outputWireCount}`
    }
}

