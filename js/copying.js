// const iframe = document.getElementById('sandboxed-iframe');

// Create a blob URL with user JS inside a script tag
// const blob = new Blob([`
//     <html>
//     <body><script>${codeBlock}<\/script></body>
//     </html>
// `], { type: 'text/html' });

// iframe.src = URL.createObjectURL(blob);

// Copy button functionality

export function copyTextToClipboard(codeBlock) {
    navigator.clipboard.writeText(codeBlock)
        .catch(err => console.error("Failed to copy:", err));
}