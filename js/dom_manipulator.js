export function newCodeBlock(contents) {
    const parent = document.getElementById('bank-data-output');
    if (parent === null) {
        return
    }
    parent.innerHTML += `
    <pre>
        <button class="copy-btn">Copy</button>
        <code class="code-block">${contents}</code>
    </pre>
    `;
}