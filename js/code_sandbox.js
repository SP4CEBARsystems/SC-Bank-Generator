export function init_code_sandbox() {
    // Listen for messages from the iframe
    initConsoleListener();
}

function initConsoleListener() {
    window.addEventListener('message', (event) => {
        const output = document.getElementById('output');
        if (!output) return;
        if (event.data.type === 'result') {
            output.innerText = 'Result: ' + event.data.result[0];
        } else if (event.data.type === 'error') {
            output.innerText = 'Error: ' + event.data.error;
        }
    });
}

function initDataChainListener() {
    window.addEventListener('message', (event) => {
        const output = document.getElementById('output');
        if (!output) return;
        if (event.data.type === 'result') {
            output.innerText = 'Result: ' + event.data.result[0];
            sendArgumentsToIframe(iframe, arg1, arg2)
        } else if (event.data.type === 'error') {
            output.innerText = 'Error: ' + event.data.error;
        }
    });
}

export function runUserFunction(inputArray) {
    const userCode = document.getElementById('codeInput')?.value.trim();
    const arg1 = 4;
    const arg2 = 5;
    const iframe = document.getElementById('sandbox');
    const outputElement = document.getElementById('output');

    // Reset output
    outputElement.innerText = 'Running...';

    // Create a unique script that the iframe will execute
    const sandboxScript = `
        <script>
            'use strict';
            window.addEventListener('message', (event) => {
                if (event.data.type === 'runFunction') {
                    try {
                        const timeout = setTimeout(() => { throw new Error('Execution timed out!'); }, 3000);
                        const userFunction = ${userCode}; // Convert to function
                        if (typeof userFunction !== 'function') throw new Error('Invalid function format');
                        const result = ${inputArray}.map(userFunction);
                        clearTimeout(timeout);
                        window.parent.postMessage({ type: 'result', result: result }, '*');
                    } catch (error) {
                        window.parent.postMessage({ type: 'error', error: error.message }, '*');
                    }
                }
            });
        </script>
    `;

    // const result = userFunction(event.data.args[0], event.data.args[1]);

    // Load the script into the sandboxed iframe
    iframe.srcdoc = `<html><body>${sandboxScript}</body></html>`;

    // Wait for iframe to load before sending data
    // sendArgumentsToIframe(iframe, arg1, arg2);
}

export function sendArgumentsToIframe(iframe, ...functionArguments) {
    setTimeout(() => {
        iframe.contentWindow.postMessage({
            type: 'runFunction',
            args: [...functionArguments]
        }, '*');
    }, 500);
}

