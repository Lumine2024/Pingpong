import { controller } from "./shapes";
import { clamp, clampMagnitude, distanceSquared, scale, vecAdd, vecSub } from "./mathutil";
import { CONFIG } from "./config";
export class SceneController {
    constructor() {
        this.ballVelocity = SceneController.createInitialBallVelocity();
        this.rect1Velocity = {
            x: 0,
            y: 0
        };
        this.rect2Velocity = {
            x: 0,
            y: 0
        };
    }
    static createInitialBallVelocity() {
        const randomInitialY = (Math.random() * 2 - 1) * CONFIG.BALL_VELOCITY;
        return clampMagnitude({
            x: CONFIG.BALL_VELOCITY,
            y: randomInitialY
        }, CONFIG.BALL_VELOCITY);
    }
    reset(state) {
        controller.setRect1Position(state.rect1Position.x, state.rect1Position.y);
        controller.setRect2Position(state.rect2Position.x, state.rect2Position.y);
        controller.setBallPosition(state.ballPosition.x, state.ballPosition.y);
        this.rect1Velocity = { x: 0, y: 0 };
        this.rect2Velocity = { x: 0, y: 0 };
        this.ballVelocity = SceneController.createInitialBallVelocity();
    }
    getBallVelocity() {
        return this.ballVelocity;
    }
    getRect1Velocity() {
        return this.rect1Velocity;
    }
    getRect2Velocity() {
        return this.rect2Velocity;
    }
    setRect1Velocity(velocity) {
        this.rect1Velocity = clampMagnitude(velocity, CONFIG.MAX_RECT_VELOCITY);
    }
    setRect2Velocity(velocity) {
        this.rect2Velocity = clampMagnitude(velocity, CONFIG.MAX_RECT_VELOCITY);
    }
    getRect1Position() {
        return controller.getRect1Position();
    }
    getRect2Position() {
        return controller.getRect2Position();
    }
    getBallPosition() {
        return controller.getBallPosition();
    }
    static clampPosition(position, upBound, downBound, leftBound, rightBound) {
        return {
            x: clamp(position.x, leftBound, rightBound),
            y: clamp(position.y, upBound, downBound)
        };
    }
    static clampRectPosition(position) {
        return SceneController.clampPosition(position, 0, CONFIG.STAGE_HEIGHT - CONFIG.RECT_HEIGHT, 0, CONFIG.STAGE_WIDTH - CONFIG.RECT_WIDTH);
    }
    static isBallCollidingRect(ballPosition, rectPosition) {
        const closestPoint = SceneController.clampPosition(ballPosition, rectPosition.y, rectPosition.y + CONFIG.RECT_HEIGHT, rectPosition.x, rectPosition.x + CONFIG.RECT_WIDTH);
        return distanceSquared(ballPosition, closestPoint) <= CONFIG.BALL_RADIUS * CONFIG.BALL_RADIUS;
    }
    applyRectCollision(rectVelocity, hitRect) {
        const relativeVelocity = vecSub(this.ballVelocity, rectVelocity);
        const reflectedRelativeVelocityX = -relativeVelocity.x;
        const newWorldVelocityX = reflectedRelativeVelocityX + rectVelocity.x;
        const directedVelocityX = hitRect === "rect1"
            ? Math.abs(newWorldVelocityX)
            : -Math.abs(newWorldVelocityX);
        this.ballVelocity = scale({
            x: directedVelocityX,
            y: relativeVelocity.y + rectVelocity.y
        }, CONFIG.BALL_VELOCITY);
    }
    gameLoop() {
        // update positions
        const rect1Position = this.getRect1Position();
        const rect1Velocity = this.getRect1Velocity();
        const nextRect1Position = SceneController.clampRectPosition(vecAdd(rect1Position, rect1Velocity));
        const boundedRect1Position = SceneController.clampPosition(nextRect1Position, 0, CONFIG.STAGE_HEIGHT - CONFIG.RECT_HEIGHT, 0, CONFIG.STAGE_WIDTH / 3);
        controller.setRect1Position(boundedRect1Position.x, boundedRect1Position.y);
        const rect2Position = this.getRect2Position();
        const rect2Velocity = this.getRect2Velocity();
        const nextRect2Position = SceneController.clampRectPosition(vecAdd(rect2Position, rect2Velocity));
        const boundedRect2Position = SceneController.clampPosition(nextRect2Position, 0, CONFIG.STAGE_HEIGHT - CONFIG.RECT_HEIGHT, CONFIG.STAGE_WIDTH * 2 / 3, CONFIG.STAGE_WIDTH - CONFIG.RECT_WIDTH);
        controller.setRect2Position(boundedRect2Position.x, boundedRect2Position.y);
        const ballPosition = this.getBallPosition();
        const ballVelocity = this.getBallVelocity();
        const nextBallPosition = vecAdd(ballPosition, ballVelocity);
        controller.setBallPosition(nextBallPosition.x, nextBallPosition.y);
        // detect collisions and change ball velocity
        // first, check if the ball is going out of bound
        if (nextBallPosition.x <= 0) {
            return 2;
        }
        if (nextBallPosition.x >= CONFIG.STAGE_WIDTH - CONFIG.BALL_RADIUS) {
            return 1;
        }
        if (nextBallPosition.y <= 0 || nextBallPosition.y >= CONFIG.STAGE_HEIGHT - CONFIG.BALL_RADIUS) {
            this.ballVelocity.y *= -1;
        }
        // then, check if the ball is going to go inside any rect
        const rect1CurrentPosition = this.getRect1Position();
        if (SceneController.isBallCollidingRect(nextBallPosition, rect1CurrentPosition)) {
            this.applyRectCollision(this.getRect1Velocity(), "rect1");
            controller.setBallPosition(rect1CurrentPosition.x + CONFIG.RECT_WIDTH + CONFIG.BALL_RADIUS, nextBallPosition.y);
            return 0;
        }
        const rect2CurrentPosition = this.getRect2Position();
        if (SceneController.isBallCollidingRect(nextBallPosition, rect2CurrentPosition)) {
            this.applyRectCollision(this.getRect2Velocity(), "rect2");
            controller.setBallPosition(rect2CurrentPosition.x - CONFIG.BALL_RADIUS, nextBallPosition.y);
        }
        return 0;
    }
}
export const sceneController = new SceneController();
