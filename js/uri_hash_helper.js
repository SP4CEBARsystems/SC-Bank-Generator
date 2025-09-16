/**
 * Opens the <details> element containing the element referenced by the URL hash,
 * and smoothly scrolls the target element into view.
 *
 * If the hash is empty or the target element does not exist, the function does nothing.
 *
 * @function
 */
export default () => {
    const hash = window.location.hash.substring(1); // get hash without '#'
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    const details = target.closest("details") ?? target.querySelector("details");
    if (details) {
        details.open = true;
    }
    target.scrollIntoView({ behavior: "smooth" });
};
