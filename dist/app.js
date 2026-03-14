"use strict";
(() => {
  // src/shapes.ts
  var ShapeController = class {
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
      } else if (shape === "rect2") {
        this.setRect2Position(x, y);
      } else {
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
      } else if (shape === "rect2") {
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
  };
  var controller = new ShapeController();
  window.shapeController = controller;

  // src/mathutil.ts
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function modulus(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  }
  function modulusSquared(vec) {
    return vec.x * vec.x + vec.y * vec.y;
  }
  function scale(vec, newModulus) {
    const oldModulus = modulus(vec);
    if (oldModulus === 0) {
      return { x: 0, y: 0 };
    } else {
      return {
        x: vec.x * newModulus / oldModulus,
        y: vec.y * newModulus / oldModulus
      };
    }
  }
  function clampMagnitude(vec, magnitude) {
    if (modulus(vec) <= magnitude) {
      return vec;
    } else {
      return scale(vec, magnitude);
    }
  }
  function vecAdd(a, b) {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  }
  function vecSub(a, b) {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    };
  }
  function vecDot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  function distanceSquared(a, b) {
    return modulusSquared(vecSub(a, b));
  }
  function pointAtTime(start, velocity, time) {
    return {
      x: start.x + velocity.x * time,
      y: start.y + velocity.y * time
    };
  }
  function closestApproachTime(target, source, sourceVelocity) {
    const speedSquared = modulusSquared(sourceVelocity);
    if (speedSquared === 0) {
      return null;
    }
    const fromSourceToTarget = vecSub(target, source);
    return vecDot(fromSourceToTarget, sourceVelocity) / speedSquared;
  }

  // src/config.ts
  var CONFIG = Object.freeze({
    STAGE_WIDTH: 900,
    STAGE_HEIGHT: 500,
    RECT_WIDTH: 40,
    RECT_HEIGHT: 150,
    BALL_RADIUS: 25,
    BALL_VELOCITY: 3,
    MAX_RECT_VELOCITY: 1.5
  });

  // src/scene_controller.ts
  var SceneController = class _SceneController {
    constructor() {
      this.ballVelocity = _SceneController.createInitialBallVelocity();
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
      this.ballVelocity = _SceneController.createInitialBallVelocity();
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
      return _SceneController.clampPosition(position, 0, CONFIG.STAGE_HEIGHT - CONFIG.RECT_HEIGHT, 0, CONFIG.STAGE_WIDTH - CONFIG.RECT_WIDTH);
    }
    static isBallCollidingRect(ballPosition, rectPosition) {
      const closestPoint = _SceneController.clampPosition(
        ballPosition,
        rectPosition.y,
        rectPosition.y + CONFIG.RECT_HEIGHT,
        rectPosition.x,
        rectPosition.x + CONFIG.RECT_WIDTH
      );
      return distanceSquared(ballPosition, closestPoint) <= CONFIG.BALL_RADIUS * CONFIG.BALL_RADIUS;
    }
    applyRectCollision(rectVelocity, hitRect) {
      const relativeVelocity = vecSub(this.ballVelocity, rectVelocity);
      const reflectedRelativeVelocityX = -relativeVelocity.x;
      const newWorldVelocityX = reflectedRelativeVelocityX + rectVelocity.x;
      const directedVelocityX = hitRect === "rect1" ? Math.abs(newWorldVelocityX) : -Math.abs(newWorldVelocityX);
      this.ballVelocity = {
        x: directedVelocityX,
        y: relativeVelocity.y + rectVelocity.y
      };
    }
    gameLoop() {
      const rect1Position = this.getRect1Position();
      const rect1Velocity = this.getRect1Velocity();
      const nextRect1Position = _SceneController.clampRectPosition(vecAdd(rect1Position, rect1Velocity));
      const boundedRect1Position = _SceneController.clampPosition(
        nextRect1Position,
        0,
        CONFIG.STAGE_HEIGHT - CONFIG.RECT_HEIGHT,
        0,
        CONFIG.STAGE_WIDTH / 3
      );
      controller.setRect1Position(boundedRect1Position.x, boundedRect1Position.y);
      const rect2Position = this.getRect2Position();
      const rect2Velocity = this.getRect2Velocity();
      const nextRect2Position = _SceneController.clampRectPosition(vecAdd(rect2Position, rect2Velocity));
      const boundedRect2Position = _SceneController.clampPosition(
        nextRect2Position,
        0,
        CONFIG.STAGE_HEIGHT - CONFIG.RECT_HEIGHT,
        CONFIG.STAGE_WIDTH * 2 / 3,
        CONFIG.STAGE_WIDTH - CONFIG.RECT_WIDTH
      );
      controller.setRect2Position(boundedRect2Position.x, boundedRect2Position.y);
      const ballPosition = this.getBallPosition();
      const ballVelocity = this.getBallVelocity();
      const nextBallPosition = vecAdd(ballPosition, ballVelocity);
      controller.setBallPosition(nextBallPosition.x, nextBallPosition.y);
      if (nextBallPosition.x <= 0) {
        return 2;
      }
      if (nextBallPosition.x >= CONFIG.STAGE_WIDTH - CONFIG.BALL_RADIUS) {
        return 1;
      }
      if (nextBallPosition.y <= 0 || nextBallPosition.y >= CONFIG.STAGE_HEIGHT - CONFIG.BALL_RADIUS) {
        this.ballVelocity.y *= -1;
      }
      const rect1CurrentPosition = this.getRect1Position();
      if (_SceneController.isBallCollidingRect(nextBallPosition, rect1CurrentPosition)) {
        this.applyRectCollision(this.getRect1Velocity(), "rect1");
        controller.setBallPosition(rect1CurrentPosition.x + CONFIG.RECT_WIDTH + CONFIG.BALL_RADIUS, nextBallPosition.y);
        return 0;
      }
      const rect2CurrentPosition = this.getRect2Position();
      if (_SceneController.isBallCollidingRect(nextBallPosition, rect2CurrentPosition)) {
        this.applyRectCollision(this.getRect2Velocity(), "rect2");
        controller.setBallPosition(rect2CurrentPosition.x - CONFIG.BALL_RADIUS, nextBallPosition.y);
      }
      this.ballVelocity = scale(this.ballVelocity, CONFIG.BALL_VELOCITY);
      return 0;
    }
  };
  var sceneController = new SceneController();

  // src/player_base.ts
  var PlayerBase = class {
    constructor(name) {
      this.name = name;
    }
    setVelocity(velocity) {
      if (this.name == "rect1") {
        sceneController.setRect1Velocity(velocity);
      } else {
        sceneController.setRect2Velocity(velocity);
      }
    }
    getPosition() {
      if (this.name == "rect1") {
        return sceneController.getRect1Position();
      } else {
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
  };

  // src/ai.ts
  var AI = class extends PlayerBase {
    getPaddleCenter(position) {
      return {
        x: position.x + CONFIG.RECT_WIDTH / 2,
        y: position.y + CONFIG.RECT_HEIGHT / 2
      };
    }
    getVelocityToward(target, fullSpeed) {
      const currentCenter = this.getPaddleCenter(this.getPosition());
      const direction = vecSub(target, currentCenter);
      const distance = modulus(direction);
      if (distance === 0) {
        return { x: 0, y: 0 };
      }
      if (fullSpeed) {
        return clampMagnitude(direction, CONFIG.MAX_RECT_VELOCITY);
      }
      return direction;
    }
    update() {
      const isRect1 = this.getName() === "rect1";
      const ballPosition = this.getBallPosition();
      const ballVelocity = this.getBallVelocity();
      const ballMovingTowardSelf = isRect1 ? ballVelocity.x < 0 : ballVelocity.x > 0;
      if (!ballMovingTowardSelf) {
        const idleTarget = isRect1 ? { x: CONFIG.STAGE_WIDTH / 6, y: CONFIG.STAGE_HEIGHT / 2 } : { x: CONFIG.STAGE_WIDTH * 5 / 6, y: CONFIG.STAGE_HEIGHT / 2 };
        this.setVelocity(this.getVelocityToward(idleTarget, true));
        return;
      }
      const currentCenter = this.getPaddleCenter(this.getPosition());
      const rawTimeToFoot = closestApproachTime(currentCenter, ballPosition, ballVelocity);
      if (rawTimeToFoot === null) {
        this.setVelocity({ x: 0, y: 0 });
        return;
      }
      let ballTimeToFoot = rawTimeToFoot;
      if (ballTimeToFoot <= 0) {
        ballTimeToFoot = 1 / 60;
      }
      const footPoint = pointAtTime(ballPosition, ballVelocity, ballTimeToFoot);
      const toFoot = vecSub(footPoint, currentCenter);
      const distanceToFoot = modulus(toFoot);
      if (distanceToFoot === 0) {
        this.setVelocity({ x: 0, y: 0 });
        return;
      }
      const requiredSpeed = distanceToFoot / ballTimeToFoot;
      const targetSpeed = Math.min(requiredSpeed, CONFIG.MAX_RECT_VELOCITY);
      this.setVelocity(scale(toFoot, targetSpeed));
    }
  };

  // src/player.ts
  var Player = class extends PlayerBase {
    constructor(name) {
      super(name);
      this.pressedKeys = /* @__PURE__ */ new Set();
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
      if (this.getName() == "rect1") {
        this.updateWithKeys("KeyW", "KeyS", "KeyA", "KeyD");
      } else {
        this.updateWithKeys("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
      }
    }
  };

  // src/game_manager.ts
  var GameManager = class {
    constructor() {
      const gameResultElement = document.getElementById("game-result");
      const restartButton = document.getElementById("restart-button");
      if (!gameResultElement || !restartButton) {
        throw new Error("Required game UI elements are missing.");
      }
      this.gameResultElement = gameResultElement;
      this.restartButton = restartButton;
      this.leftPlayer = null;
      this.rightPlayer = null;
      this.running = false;
      this.initialState = null;
      this.restartButton.textContent = "\u5F00\u59CB\u6E38\u620F";
      this.restartButton.addEventListener("click", () => {
        this.startOrRestart();
      });
    }
    init(leftPlayer, rightPlayer) {
      this.leftPlayer = leftPlayer;
      this.rightPlayer = rightPlayer;
      this.initialState = {
        rect1Position: { ...sceneController.getRect1Position() },
        rect2Position: { ...sceneController.getRect2Position() },
        ballPosition: { ...sceneController.getBallPosition() }
      };
      this.running = false;
      this.restartButton.textContent = "\u5F00\u59CB\u6E38\u620F";
      this.gameResultElement.textContent = "";
    }
    startOrRestart() {
      if (!this.initialState) {
        return;
      }
      sceneController.reset(this.initialState);
      this.running = true;
      this.restartButton.textContent = "\u91CD\u65B0\u5F00\u59CB";
      this.gameResultElement.textContent = "";
    }
    gameLoop() {
      if (!this.running || !this.leftPlayer || !this.rightPlayer) {
        return;
      }
      this.leftPlayer.update();
      this.rightPlayer.update();
      const winner = sceneController.gameLoop();
      if (winner !== 0) {
        this.running = false;
        const winnerName = winner === 1 ? "Player" : "AI";
        console.log(`Game Over: ${winnerName} wins.`);
        this.gameResultElement.textContent = `Winner: ${winnerName}`;
      }
    }
  };
  var gameManager = new GameManager();

  // src/main.ts
  gameManager.init(new Player("rect1"), new AI("rect2"));
  function gameLoop() {
    gameManager.gameLoop();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
})();
//# sourceMappingURL=app.js.map
