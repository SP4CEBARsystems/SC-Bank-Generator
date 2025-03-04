// const iframe = document.getElementById('sandboxed-iframe');

// Create a blob URL with user JS inside a script tag
// const blob = new Blob([`
//     <html>
//     <body><script>${codeBlock}<\/script></body>
//     </html>
// `], { type: 'text/html' });

// iframe.src = URL.createObjectURL(blob);

// Copy button functionality

/**
 * 
 * @param {string} codeBlock 
 */
export function copyTextToClipboard(codeBlock) {
    navigator.clipboard.writeText(codeBlock)
        .catch(err => console.error("Failed to copy:", err));
}

/**
 * loads a text file asynchronously
 * @param {string[]} codeBlocks the path to the file to be loaded
 * @returns {Promise<void>} a promise for the string encoded into the text file
 * (resolve: (value: string) => void, reject: (reason?: any) => void)
 */
export function copyTextArrayToClipboard(codeBlocks, isWinV = false) {
	return new Promise(async (resolve, reject) => {
		for (const codeBlock of codeBlocks) {
            try {
                await navigator.clipboard.writeText(codeBlock)
                // await navigator.clipboard.readText()
                await sleep(isWinV ? 300 : 10);
            } catch (error) {
                reject(error)
            }
        }
        resolve();
	});
}

/**
 * loads a text file asynchronously
 * @param {string} filePath the path to the file to be loaded
 * @returns {Promise<string>} a promise for the string encoded into the text file
 * (resolve: (value: string) => void, reject: (reason?: any) => void)
 */
export async function loadTextFile(filePath) {
	return new Promise((resolve, reject) => {
		fetch(filePath)
		.then((response) => response.text())
		.then((data) => resolve(data))
		.catch((error) => reject(error));
	});
}

// export function loadJsonFromClipboard(){
// 	try {
// 		navigator.clipboard.readText()
//             // .then((clipText) => );
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// }

/**
 * source: https://stackoverflow.com/a/39914235/17730914
 * @param {number} ms milliseconds to wait
 * @returns {Promise<any>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}