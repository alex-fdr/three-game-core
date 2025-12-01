import { Signal } from './helpers/signal';

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

export class InputSystem {
    domElement: HTMLCanvasElement;
    enabled = false;
    handler: InputHandler | null = null;
    mouseEvents = ['mousedown', 'mousemove', 'mouseup'] as const;
    touchEvents = ['touchstart', 'touchmove', 'touchend'] as const;
    onDown: Signal<[InputStatus]> = new Signal();
    onUp: Signal<[InputStatus]> = new Signal();
    onMove: Signal<[InputStatus]> = new Signal();

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
            this.onDown.dispatch(this.handler.status);
        });

        this.domElement.addEventListener(move, (e) => {
            if (!this.enabled || !this.handler || !this.handler.pressed) {
                return;
            }

            this.handler.move(this.getEvent(e));
            this.onMove.dispatch(this.handler.status);
        });

        this.domElement.addEventListener(up, (e) => {
            if (!this.enabled || !this.handler) {
                return;
            }

            this.handler.up(this.getEvent(e));
            this.onUp.dispatch(this.handler.status);
        });
    }

    setHandler(handler: InputHandler) {
        this.handler = handler;
        this.enabled = true;
    }

    getEvent(e: TouchEvent | MouseEvent): Touch | MouseEvent {
        return e instanceof TouchEvent ? e.changedTouches[0] : e;
    }
}
