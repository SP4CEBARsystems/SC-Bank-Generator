export default class NamedVector {
    /**
     * 
     * @param {string} name 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(name, x = 0, y = 0){
        this.name = name;
        this.x = x;
        this.y = y;
    }
}