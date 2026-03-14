import { PlayerBase } from "./player_base";
import { CONFIG } from "./config";
export class Player extends PlayerBase {
    constructor(name) {
        super(name);
        this.pressedKeys = new Set();
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
    updateWithKeys(up, down, left, right) {
        let vel = {
            x: 0,
            y: 0
        };
        if (this.pressedKeys.has(up)) {
            vel.y -= CONFIG.MAX_RECT_VELOCITY;
        }
        if (this.pressedKeys.has(down)) {
            vel.y += CONFIG.MAX_RECT_VELOCITY;
        }
        if (this.pressedKeys.has(left)) {
            vel.x -= CONFIG.MAX_RECT_VELOCITY;
        }
        if (this.pressedKeys.has(right)) {
            vel.x += CONFIG.MAX_RECT_VELOCITY;
        }
        this.setVelocity(vel);
    }
    update() {
        if (this.getName() === "rect1") {
            this.updateWithKeys("KeyW", "KeyS", "KeyA", "KeyD");
        }
        else {
            this.updateWithKeys("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
        }
    }
}
