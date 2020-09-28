import ui from "./ui.js"
import world from "./world.js"
import gameOver from "./gameover.js"
import intro from "./intro.js"

const config = {
    type: Phaser.AUTO,
    width: 80 * 16,
    height: 50 * 16,
    backgroundColor: "#472d3c",
    parent: "game",
    pixelArt: true,
    zoom: 1,
    scene: [intro, world, ui, gameOver],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
}

document.fonts.load('10pt "Doomed"').then(() => {
    const game = new Phaser.Game(config)
})