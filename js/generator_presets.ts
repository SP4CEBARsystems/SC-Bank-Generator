export default class GeneratorPresets {
    /**
     * 
     * @param {number[]} param0 
     * @returns 
     */
    static addition([x, y]) {
        return [x + y];
    }

    /**
     * 
     * @param {number[]} param0 
     * @returns 
     */
    static subtraction([x, y]) {
        const value = x - y;
        return [Math.abs(value), (value < 0) ? 1:0];
    }

    static FSM([position, direction, reset]) {
        const maxPosition = 63;
        const minPosition = 0;
        if (reset != 0) {
            position = 0;
            direction = 0;
        } else {
            if (position >= maxPosition && direction == 0) {
                direction = 1;
            } else if (position <= minPosition && direction != 0) {
                direction = 0;
            } else {
                position += (direction != 0 ? -1 : 1);
            }
        }
        return [position, direction, 0];
    }

    static display([x], bankPosition) {
        return [x == bankPosition ? 0xf : 0x0];
    }

    static highResDisplay([x], bankPosition) {
        return [Math.floor(x/2) != bankPosition ? 0x0 :
            ((x % 2 == 0) ? 0x3 : 0xc)];
    }
}