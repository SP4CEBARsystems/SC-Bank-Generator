import Code from "./Code.js";

export default class standardCode {
    static addition = new Code(
        ([x, y]) => {
            return [x + y];
        }
    )

    static subtraction = new Code(
        ([x, y]) => {
            const value = x - y;
            return [Math.abs(value), (value < 0) ? 1:0];
        }
    )

    static FSM = new Code(
        ([position, direction, reset]) => {
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
    )

    static display = new Code(
        ([x], bankPosition) => {
            return [x == bankPosition ? 0xf : 0x0];
        }
    )

    static highResDisplay = new Code(
        ([x], bankPosition) => {
            return [Math.floor(x/2) != bankPosition ? 0x0 :
                ((x % 2 == 0) ? 0x3 : 0xc)];
        }
    )
}