export function init_code_sandbox() {
    // Listen for messages from the iframe
    // initConsoleListener();
}

export function initConsoleListener(callback) {
    // console.log("initConsoleListener");
    let consoleListener = null;
    consoleListener = window.addEventListener('message', (event) => {
        console.log("message");
        const output = document.getElementById('output');
        if (!output) return;
        if (event.data.type === 'result') {
            console.log("message valid");
            output.innerText = 'Success!';
            // output.innerText = 'Result: ' + event.data.result;
            callback(event.data.result);
        } else if (event.data.type === 'error') {
            // console.log("error");
            output.innerText = 'Error: ' + event.data.error;
        }
        // if (consoleListener) {
        //     window.removeEventListener('message', consoleListener);
        // }
    });
}

// function initDataChainListener() {
//     window.addEventListener('message', (event) => {
//         const output = document.getElementById('output');
//         if (!output) return;
//         if (event.data.type === 'result') {
//             output.innerText = 'Result: ' + event.data.result[0];
//             sendArgumentsToIframe(iframe, arg1, arg2)
//         } else if (event.data.type === 'error') {
//             output.innerText = 'Error: ' + event.data.error;
//         }
//     });
// }

export function runUserFunction(inputArray) {
    const userCode = document.getElementById('codeInput')?.value.trim();
    const arg1 = 4;
    const arg2 = 5;
    const iframe = document.getElementById('sandbox');
    const outputElement = document.getElementById('output');

    // Reset output
    outputElement.innerText = 'Running...';

    let arrayString = JSON.stringify(inputArray).replace('"', '');
    // console.log('arrayString', arrayString);
    // console.log("arrayString", arrayString);
    // const result = inputArray.map((item) => item.map((item) => {
    //     console.log('item', item);
    //     return item;
    // }));
    // console.log('result', result);

    // Create a unique script that the iframe will execute
    const sandboxScript = `
        'use strict';
        window.addEventListener('message', (event) => {
            if (event.data.type === 'runFunction') {
                const timeout = setTimeout(() => { throw new Error('Execution timed out!'); }, 3000);
                try {
                    const userFunction = ${userCode}; // Convert to function
                    if (typeof userFunction !== 'function') throw new Error('Invalid function format');
                    // console.log('hey');
                    const result = event.data.args[0].map((item) => item.map((subItem) => userFunction(...subItem)));
                    clearTimeout(timeout);
                    window.parent.postMessage({ type: 'result', result: result }, '*');
                } catch (error) {
                    clearTimeout(timeout);
                    window.parent.postMessage({ type: 'error', error: error.message }, '*');
                }
            }
        });
    `;

    // const result = userFunction(event.data.args[0], event.data.args[1]);

    // Load the script into the sandboxed iframe
    iframe.srcdoc = `<html><body><script>${sandboxScript}</script></body></html>`;

    // Wait for iframe to load before sending data
    sendArgumentsToIframe(iframe, inputArray);
}

export function sendArgumentsToIframe(iframe, ...functionArguments) {
    setTimeout(() => {
        iframe.contentWindow.postMessage({
            type: 'runFunction',
            args: [...functionArguments]
        }, '*');
    }, 500);
}

