import { sceneController } from "./scene_controller";
export class GameManager {
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
        this.restartButton.textContent = "开始游戏";
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
        this.restartButton.textContent = "开始游戏";
        this.gameResultElement.textContent = "";
    }
    startOrRestart() {
        if (!this.initialState) {
            return;
        }
        sceneController.reset(this.initialState);
        this.running = true;
        this.restartButton.textContent = "重新开始";
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
}
export const gameManager = new GameManager();
