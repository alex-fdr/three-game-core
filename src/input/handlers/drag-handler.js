export class DragHandler {
    constructor() {
        this.pressed = false;
        this.status = {
            currX: 0,
            currY: 0,
            prevX: 0,
            prevY: 0,
            deltaX: 0,
            deltaY: 0,
        };
    }

    down(e) {
        this.pressed = true;
        this.status.currX = e.clientX;
        this.status.currY = e.clientY;
        this.status.prevX = this.status.currX;
        this.status.prevY = this.status.currY;
    }

    move(e) {
        if (!this.pressed) {
            return;
        }

        this.status.currX = e.clientX;
        this.status.currY = e.clientY;
        this.status.deltaX = this.status.currX - this.status.prevX;
        this.status.deltaY = this.status.currY - this.status.prevY;
    }

    up(e) {
        this.pressed = false;
        this.status.deltaX = this.status.currX - this.status.prevX;
        this.status.deltaY = this.status.currY - this.status.prevY;
        // this.currX = this.currY = this.prevX = this.prevY = 0
    }
}
