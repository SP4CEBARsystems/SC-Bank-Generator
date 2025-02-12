const generateButtonElement = document.getElementById('runUserFunction');
if (generateButtonElement) {
    generateButtonElement.addEventListener('click', runUserFunction);
}

function runUserFunction() {
    const userCode = document.getElementById('codeInput')?.value.trim();
    const arg1 = parseFloat(document.getElementById('arg1')?.value);
    const arg2 = parseFloat(document.getElementById('arg2')?.value);
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

                        const result = userFunction(event.data.args[0], event.data.args[1]);
                        clearTimeout(timeout);

                        window.parent.postMessage({ type: 'result', result: result }, '*');
                    } catch (error) {
                        window.parent.postMessage({ type: 'error', error: error.message }, '*');
                    }
                }
            });
        </script>
    `;

    // Load the script into the sandboxed iframe
    iframe.srcdoc = `<html><body>${sandboxScript}</body></html>`;

    // Wait for iframe to load before sending data
    setTimeout(() => {
        iframe.contentWindow.postMessage({
            type: 'runFunction',
            args: [arg1, arg2]
        }, '*');
    }, 500);
}

// Listen for messages from the iframe
window.addEventListener('message', (event) => {
    if (event.data.type === 'result') {
        document.getElementById('output').innerText = 'Result: ' + event.data.result;
    } else if (event.data.type === 'error') {
        document.getElementById('output').innerText = 'Error: ' + event.data.error;
    }
});
