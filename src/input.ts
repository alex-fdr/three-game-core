export interface InputHandler {
    down(e: MouseEvent | Touch): void;
    move(e: MouseEvent | Touch): void;
    up(e: MouseEvent | Touch): void;
    pressed?: boolean;
    status: InputStatus;
}

export interface InputStatus {
    currX: number;
    currY: number;
    prevX: number;
    prevY: number;
    deltaX: number;
    deltaY: number;
}

export type InputCallback = (data: InputStatus) => void;

export class InputSystem {
    domElement: HTMLCanvasElement;
    enabled = false;
    handler: InputHandler | null = null;
    mouseEvents = ['mousedown', 'mousemove', 'mouseup'] as const;
    touchEvents = ['touchstart', 'touchmove', 'touchend'] as const;
    callbacks: {
        down: InputCallback[];
        up: InputCallback[];
        move: InputCallback[];
    } = { down: [], move: [], up: [] };

    constructor(domElement: HTMLCanvasElement) {
        this.domElement = domElement;
    }

    init() {
        const supportTouchEvent = 'ontouchstart' in document.documentElement;
        const isTouch = supportTouchEvent || navigator?.maxTouchPoints >= 1;
        const [down, move, up] = isTouch ? this.touchEvents : this.mouseEvents;

        this.domElement.addEventListener(down, (e: MouseEvent | TouchEvent) => {
            if (!this.enabled || !this.handler) {
                return;
            }

            if (e instanceof TouchEvent) {
                if (e?.touches?.length > 1) {
                    e.preventDefault();
                }
            }

            this.handler.down(this.getEvent(e));

            for (const cb of this.callbacks.down) {
                cb(this.handler.status);
            }
        });

        this.domElement.addEventListener(move, (e) => {
            if (!this.enabled || !this.handler || !this.handler.pressed) {
                return;
            }

            this.handler.move(this.getEvent(e));

            for (const cb of this.callbacks.move) {
                cb(this.handler.status);
            }
        });

        this.domElement.addEventListener(up, (e) => {
            if (!this.enabled || !this.handler) {
                return;
            }

            this.handler.up(this.getEvent(e));

            for (const cb of this.callbacks.up) {
                cb(this.handler.status);
            }
        });
    }

    setHandler(handler: InputHandler) {
        this.handler = handler;
        this.enabled = true;
    }

    getEvent(e: TouchEvent | MouseEvent): Touch | MouseEvent {
        return e instanceof TouchEvent ? e.changedTouches[0] : e;
    }

    onDown(cb: InputCallback) {
        this.callbacks.down.push(cb);
    }

    onMove(cb: InputCallback) {
        this.callbacks.move.push(cb);
    }

    onUp(cb: InputCallback) {
        this.callbacks.up.push(cb);
    }
}
