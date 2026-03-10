export type ShapeName = "rect1" | "rect2" | "ball";
import { Vector } from "./mathutil";

export class ShapeController {
    private readonly rect1: SVGRectElement;
    private readonly rect2: SVGRectElement;
    private readonly ball: SVGCircleElement;
    private requireElement<T extends SVGElement>(id: string): T {
        const element = document.querySelector(`#${id}`);
        if(!element) {
            throw new Error(`Element with id "${id}" not found.`);
        }
        if(!(element instanceof SVGElement)) {
            throw new Error(`Element with id "${id}" is not an SVG element.`);
        }
        return element as T;
    }
    constructor() {
        this.rect1 = this.requireElement<SVGRectElement>("rect1");
        this.rect2 = this.requireElement<SVGRectElement>("rect2");
        this.ball = this.requireElement<SVGCircleElement>("ball");
    }
    setRect1Position(x: number, y: number): void {
        this.rect1.setAttribute("x", String(x));
        this.rect1.setAttribute("y", String(y));
    }
    setRect2Position(x: number, y: number): void {
        this.rect2.setAttribute("x", String(x));
        this.rect2.setAttribute("y", String(y));
    }
    setBallPosition(x: number, y: number): void {
        this.ball.setAttribute("cx", String(x));
        this.ball.setAttribute("cy", String(y));
    }
    setPosition(shape: ShapeName, x: number, y: number): void {
        if(shape === "rect1") {
            this.setRect1Position(x, y);
        } else if(shape === "rect2") {
            this.setRect2Position(x, y);
        } else {
            this.setBallPosition(x, y);
        }
    }
    getBallPosition(): Vector {
        return {
            x: Number(this.ball.getAttribute("cx")),
            y: Number(this.ball.getAttribute("cy"))
        };
    }
    getRect1Position(): Vector {
        return {
            x: Number(this.rect1.getAttribute("x")),
            y: Number(this.rect1.getAttribute("y"))
        };
    }
    getRect2Position(): Vector {
        return {
            x: Number(this.rect2.getAttribute("x")),
            y: Number(this.rect2.getAttribute("y"))
        };
    }
    getPosition(shape: ShapeName): Vector {
        if(shape === "rect1") {
            return {
                x: Number(this.rect1.getAttribute("x")),
                y: Number(this.rect1.getAttribute("y"))
            };
        } else if(shape === "rect2") {
            return {
                x: Number(this.rect2.getAttribute("x")),
                y: Number(this.rect2.getAttribute("y"))
            };
        } else {
            return {
                x: Number(this.ball.getAttribute("cx")),
                y: Number(this.ball.getAttribute("cy"))
            };
        }
    }
}

export const controller = new ShapeController();

// Expose controls for quick testing in browser console.
(window as Window & { shapeController?: ShapeController }).shapeController = controller;
