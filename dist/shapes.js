export class ShapeController {
    requireElement(id) {
        const element = document.querySelector(`#${id}`);
        if (!element) {
            throw new Error(`Element with id "${id}" not found.`);
        }
        if (!(element instanceof SVGElement)) {
            throw new Error(`Element with id "${id}" is not an SVG element.`);
        }
        return element;
    }
    constructor() {
        this.rect1 = this.requireElement("rect1");
        this.rect2 = this.requireElement("rect2");
        this.ball = this.requireElement("ball");
    }
    setRect1Position(x, y) {
        this.rect1.setAttribute("x", String(x));
        this.rect1.setAttribute("y", String(y));
    }
    setRect2Position(x, y) {
        this.rect2.setAttribute("x", String(x));
        this.rect2.setAttribute("y", String(y));
    }
    setBallPosition(x, y) {
        this.ball.setAttribute("cx", String(x));
        this.ball.setAttribute("cy", String(y));
    }
    setPosition(shape, x, y) {
        if (shape === "rect1") {
            this.setRect1Position(x, y);
        }
        else if (shape === "rect2") {
            this.setRect2Position(x, y);
        }
        else {
            this.setBallPosition(x, y);
        }
    }
    getBallPosition() {
        return {
            x: Number(this.ball.getAttribute("cx")),
            y: Number(this.ball.getAttribute("cy"))
        };
    }
    getRect1Position() {
        return {
            x: Number(this.rect1.getAttribute("x")),
            y: Number(this.rect1.getAttribute("y"))
        };
    }
    getRect2Position() {
        return {
            x: Number(this.rect2.getAttribute("x")),
            y: Number(this.rect2.getAttribute("y"))
        };
    }
    getPosition(shape) {
        if (shape === "rect1") {
            return {
                x: Number(this.rect1.getAttribute("x")),
                y: Number(this.rect1.getAttribute("y"))
            };
        }
        else if (shape === "rect2") {
            return {
                x: Number(this.rect2.getAttribute("x")),
                y: Number(this.rect2.getAttribute("y"))
            };
        }
        else {
            return {
                x: Number(this.ball.getAttribute("cx")),
                y: Number(this.ball.getAttribute("cy"))
            };
        }
    }
}
export const controller = new ShapeController();
// Expose controls for quick testing in browser console.
window.shapeController = controller;
