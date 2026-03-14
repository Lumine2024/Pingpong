export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function modulus(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}
export function modulusSquared(vec) {
    return vec.x * vec.x + vec.y * vec.y;
}
export function scale(vec, newModulus) {
    const oldModulus = modulus(vec);
    if (oldModulus === 0) {
        return { x: 0, y: 0 };
    }
    else {
        return {
            x: vec.x * newModulus / oldModulus,
            y: vec.y * newModulus / oldModulus
        };
    }
}
export function clampMagnitude(vec, magnitude) {
    if (modulus(vec) <= magnitude) {
        return vec;
    }
    else {
        return scale(vec, magnitude);
    }
}
export function vecAdd(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}
export function vecSub(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}
export function vecDot(a, b) {
    return a.x * b.x + a.y * b.y;
}
export function distanceSquared(a, b) {
    return modulusSquared(vecSub(a, b));
}
export function pointAtTime(start, velocity, time) {
    return {
        x: start.x + velocity.x * time,
        y: start.y + velocity.y * time
    };
}
export function closestApproachTime(target, source, sourceVelocity) {
    const speedSquared = modulusSquared(sourceVelocity);
    if (speedSquared === 0) {
        return null;
    }
    const fromSourceToTarget = vecSub(target, source);
    return vecDot(fromSourceToTarget, sourceVelocity) / speedSquared;
}
