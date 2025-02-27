export default class HTMLInputElementCustom {
    /**
     * @type {HTMLInputElement|null}
     */
    element

    /**
     * @param {string} id to access the element by
     */
    constructor(id){
        this.element = /** @type {HTMLInputElement|null} */ document.getElementById(id);
    }

    /**
     * @param {string} text to be written inside the element
     * @returns true if successful
     */
    setText(text) {
        if (!this.element) return false;
        this.element.value = text;
        return true;
    }

    /**
     * @returns the textContent of the element or null if undefined
     */
    getText(){
        if (!this.element) return null;
        return this.element.value;
    }

    /**
     * @returns the textContent of the element or null if undefined
     */
    getNumber(){
        if (!this.element) return null;
        return parseFloat(this.element.value);
    }
}