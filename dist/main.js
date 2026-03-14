import { AI } from "./ai";
import { Player } from "./player";
import { gameManager } from "./game_manager";
gameManager.init(new Player("rect1"), new AI("rect2"));
function gameLoop() {
    gameManager.gameLoop();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
