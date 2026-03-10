import { PlayerBase } from "./player_base";
import { clampMagnitude, closestApproachTime, modulus, pointAtTime, scale, vecSub, Vector } from "./mathutil";
import { CONFIG } from "./config";

export class AI extends PlayerBase {
    private getPaddleCenter(position: Vector): Vector {
        return {
            x: position.x + CONFIG.RECT_WIDTH / 2,
            y: position.y + CONFIG.RECT_HEIGHT / 2
        };
    }
    private getVelocityToward(target: Vector, fullSpeed: boolean): Vector {
        const currentCenter = this.getPaddleCenter(this.getPosition());
        const direction = vecSub(target, currentCenter);
        const distance = modulus(direction);
        if(distance === 0) {
            return { x: 0, y: 0 };
        }
        if(fullSpeed) {
            return clampMagnitude(direction, CONFIG.MAX_RECT_VELOCITY);
        }
        return direction;
    }
    override update(): void {
        const isRect1 = this.getName() === "rect1";
        const ballPosition = this.getBallPosition();
        const ballVelocity = this.getBallVelocity();
        const ballMovingTowardSelf = isRect1
            ? ballVelocity.x < 0
            : ballVelocity.x > 0;
        if(!ballMovingTowardSelf) {
            const idleTarget = isRect1
                ? { x: CONFIG.STAGE_WIDTH / 6, y: CONFIG.STAGE_HEIGHT / 2 }
                : { x: CONFIG.STAGE_WIDTH * 5 / 6, y: CONFIG.STAGE_HEIGHT / 2 };
            this.setVelocity(this.getVelocityToward(idleTarget, true));
            return;
        }
        const currentCenter = this.getPaddleCenter(this.getPosition());
        const rawTimeToFoot = closestApproachTime(currentCenter, ballPosition, ballVelocity);
        if(rawTimeToFoot === null) {
            this.setVelocity({ x: 0, y: 0 });
            return;
        }
        let ballTimeToFoot = rawTimeToFoot;
        if(ballTimeToFoot <= 0) {
            ballTimeToFoot = 1 / 60;
        }
        const footPoint = pointAtTime(ballPosition, ballVelocity, ballTimeToFoot);
        const toFoot = vecSub(footPoint, currentCenter);
        const distanceToFoot = modulus(toFoot);
        if(distanceToFoot === 0) {
            this.setVelocity({ x: 0, y: 0 });
            return;
        }
        const requiredSpeed = distanceToFoot / ballTimeToFoot;
        const targetSpeed = Math.min(requiredSpeed, CONFIG.MAX_RECT_VELOCITY);
        this.setVelocity(scale(toFoot, targetSpeed));
    }
}