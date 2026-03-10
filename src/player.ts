import { PlayerBase } from "./player_base";
import { Vector } from "./mathutil";
import { CONFIG } from "./config";

export class Player extends PlayerBase {
    private pressedKeys: Set<string>;
    constructor(name: "rect1" | "rect2") {
        super(name);
        this.pressedKeys = new Set<string>();
        window.addEventListener("keydown", (event) => {
            this.pressedKeys.add(event.code);
        });
        window.addEventListener("keyup", (event) => {
            this.pressedKeys.delete(event.code);
        });
        window.addEventListener("blur", () => {
            this.pressedKeys.clear();
        });
    }
    private updateWithKeys(up: string, down: string, left: string, right: string) {
        let vel: Vector = {
            x: 0,
            y: 0
        };
        if(this.pressedKeys.has(up)) {
            vel.y -= CONFIG.MAX_RECT_VELOCITY;
        }
        if(this.pressedKeys.has(down)) {
            vel.y += CONFIG.MAX_RECT_VELOCITY;
        }
        if(this.pressedKeys.has(left)) {
            vel.x -= CONFIG.MAX_RECT_VELOCITY;
        }
        if(this.pressedKeys.has(right)) {
            vel.x += CONFIG.MAX_RECT_VELOCITY;
        }
        this.setVelocity(vel);
    }
    override update(): void {
        if(this.getName() == "rect1") {
            this.updateWithKeys("KeyW", "KeyS", "KeyA", "KeyD");
        } else {
            this.updateWithKeys("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
        }
    }
}

