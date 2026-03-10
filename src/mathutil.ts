export interface Vector {
    x: number;
    y: number;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function modulus(vec: Vector): number {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function modulusSquared(vec: Vector): number {
    return vec.x * vec.x + vec.y * vec.y;
}

export function scale(vec: Vector, newModulus: number): Vector {
    const oldModulus = modulus(vec);
    if(oldModulus === 0) {
        return { x: 0, y: 0 };
    } else {
        return {
            x: vec.x * newModulus / oldModulus,
            y: vec.y * newModulus / oldModulus
        };
    }
}

export function clampMagnitude(vec: Vector, magnitude: number): Vector {
    if(modulus(vec) <= magnitude) {
        return vec;
    } else {
        return scale(vec, magnitude);
    }
}

export function vecAdd(a: Vector, b: Vector): Vector {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}

export function vecSub(a: Vector, b: Vector): Vector {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}

export function vecDot(a: Vector, b: Vector): number {
    return a.x * b.x + a.y * b.y;
}

export function distanceSquared(a: Vector, b: Vector): number {
    return modulusSquared(vecSub(a, b));
}

export function pointAtTime(start: Vector, velocity: Vector, time: number): Vector {
    return {
        x: start.x + velocity.x * time,
        y: start.y + velocity.y * time
    };
}

export function closestApproachTime(target: Vector, source: Vector, sourceVelocity: Vector): number | null {
    const speedSquared = modulusSquared(sourceVelocity);
    if(speedSquared === 0) {
        return null;
    }
    const fromSourceToTarget = vecSub(target, source);
    return vecDot(fromSourceToTarget, sourceVelocity) / speedSquared;
}