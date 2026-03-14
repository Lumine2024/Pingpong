import { sceneController } from "./scene_controller";
export class PlayerBase {
    constructor(name) {
        this.name = name;
    }
    setVelocity(velocity) {
        if (this.name === "rect1") {
            sceneController.setRect1Velocity(velocity);
        }
        else {
            sceneController.setRect2Velocity(velocity);
        }
    }
    getPosition() {
        if (this.name === "rect1") {
            return sceneController.getRect1Position();
        }
        else {
            return sceneController.getRect2Position();
        }
    }
    getBallPosition() {
        return sceneController.getBallPosition();
    }
    getBallVelocity() {
        return sceneController.getBallVelocity();
    }
    getName() {
        return this.name;
    }
}
