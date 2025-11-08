export interface InputHandler {
    down(e: MouseEvent | Touch): void;
    move(e: MouseEvent | Touch): void;
    up(e: MouseEvent | Touch): void;
    pressed?: boolean;
    status: InputStatus;
}

export interface InputStatus {
    currX: number,
    currY: number,
    prevX: number,
    prevY: number,
    deltaX: number,
    deltaY: number,
}