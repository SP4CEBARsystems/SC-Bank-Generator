import { copyTextToClipboard } from "./copying.js";

/**
 * 
 * @param {string} contents 
 * @returns 
 */
export function newCodeBlock(title, contents) {
    const parent = document.getElementById('bank-data-output');
    if (parent === null) {
        return
    }
    const divElement = newContainer('div', 'code-block-root', parent);
    if (divElement === null) return;
    const titleElement = newElement('h3', title, 'code-block', divElement);
    const preElement = newContainer('pre', 'code-block-root', divElement);
    if (preElement === null) return;
    const buttonElement = newButton('Copy', 'copy-btn', preElement, copyTextToClipboard, [contents]);
    const codeElement = newElement('code', contents, 'code-block', preElement);
    // parent.innerHTML += `
    // <pre class="code-block-root">
    //     <button class="copy-btn">Copy</button>
    //     <code class="code-block">${contents}</code>
    // </pre>
    // `;
}

/**
 * Creates a new container element, assigns a class, and gives it a parent element
 * @param {string} type the type of element to be created. Will be rejected if type === script.
 * @param {string} className the classname to be assigned to the created element
 * @param {HTMLElement} parentName the soon-to-be parent element
 * @returns the created element
 */
export function newContainer(type, className, parentName) {
	// if (type === 'script') return null;
	let p = document.createElement(type);
	p.className = className;
	parentName.appendChild(p);
	return p;
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {string} fileName 
 * @param {HTMLElement} parent 
 */
export function newSVGImage(x=212, y=127, width=212, height=127, fileName='bank_selector_8-bit.jpg', parent) {
	// const p = /** @type {HTMLElement} */document.createElement('image');
	// p.x = x;
	// p.y = y;
	// p.href = `assets/bank_generator_circuit_tiles/${fileName}`;
	// p.width = width;
	// p.height = height;
	// parentName.appendChild(p);
    parent.innerHTML += `<image x="${x}" y="${y}" width="${width}" height="${height}" href="assets/bank_generator_circuit_tiles/${fileName}"/>`
	// return p;
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {string} fileName 
 * @param {HTMLElement} parent 
 */
export function newSVGText(x=212, y=127, text='0', parent) {
    parent.innerHTML += `<text x="${x}" y="${y+14}" class="circuitLabel">${text}</text>`
}

/**
 * Creates a new container element, assigns a class, and gives it a parent element
 * @param {string} type the type of element to be created. Will be rejected if type === script.
 * @param {*} elementText the element's soon-to-be textContent
 * @param {string} className the classname to be assigned to the created element
 * @param {HTMLElement} parentName the soon-to-be parent element
 * @returns the created element
 */
export function newElement(type, elementText, className, parentName) {
	if (type === 'script') return null;
	let newElement = document.createElement(type);
	newElement.textContent = elementText;
	newElement.className = className;
	parentName.appendChild(newElement);
	return newElement;
}

export function newButton(elementText, className, parentName, callback, callbackParameters) {
	const buttonElement = newElement("button", elementText, className, parentName);
    if (buttonElement === null) return buttonElement;
	buttonElement.onclick = function () { callback(...callbackParameters); };
	return buttonElement;
}

export function assignCodeBlockCopyButtons() {
    const codeBlockElements = document.querySelectorAll('.code-block-root');
    for (const codeBlockElement of codeBlockElements) {
        if (codeBlockElement === null) continue;
        const codeContainer = codeBlockElement.querySelector('.code-block');
        if (codeContainer === null) continue;
        codeBlockElement.querySelector('.copy-btn')?.addEventListener('click', 
            () => copyTextToClipboard(codeContainer.textContent)
        );
    }
}

export function assignCodeBlockCopyButton() {
    const codeBlockElement = document.querySelector('.code-block-root');
    if (codeBlockElement === null) return;
    const codeContainer = codeBlockElement.querySelector('.code-block');
    if (codeContainer === null) return;
    codeBlockElement.querySelector('.copy-btn')?.addEventListener('click', 
        () => copyTextToClipboard(codeContainer.textContent)
    );
}

export function createCopyButtons() {
    [...document.querySelectorAll('.has-copy-btn')].forEach(element => {
        const code = element.querySelector('code')?.innerText ?? '';
        newButton('Copy', 'copy-btn', element, copyTextToClipboard, [code]);
    });
}

export function assignCopyButtons() {
    [...document.querySelectorAll('.copy-btn')].forEach(element => {
        const code = element.nextElementSibling?.innerText ?? '';
        element.addEventListener('click', () => copyTextToClipboard(code));
    });
}

/**
 * 
 * @param {HTMLElement} tableRoot 
 * @param {string[]} tableData 
 */
export function newTableRow(tableRoot, tableData) {
    const tableRow = newContainer('tr', '', tableRoot);
    tableData.map(text => newElement('td', text, '', tableRow));
}