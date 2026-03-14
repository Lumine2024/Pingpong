import { sceneController } from "./scene_controller";
import { Vector } from "./mathutil";

export abstract class PlayerBase {
    private name: "rect1" | "rect2";
    constructor(name: "rect1" | "rect2") {
        this.name = name;
    }
    setVelocity(velocity: Vector) {
        if(this.name === "rect1") {
            sceneController.setRect1Velocity(velocity);
        } else {
            sceneController.setRect2Velocity(velocity);
        }
    }
    getPosition(): Vector {
        if(this.name === "rect1") {
            return sceneController.getRect1Position();
        } else {
            return sceneController.getRect2Position();
        }
    }
    getBallPosition(): Vector {
        return sceneController.getBallPosition();
    }
    getBallVelocity(): Vector {
        return sceneController.getBallVelocity();
    }
    getName(): "rect1" | "rect2" {
        return this.name;
    }
    abstract update(): void;
}

