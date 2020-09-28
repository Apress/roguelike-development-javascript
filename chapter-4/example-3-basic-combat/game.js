import dungeon from "./dungeon.js"
import tm from "./turnManager.js"
import PlayerCharacter from "./player.js"
import BasicMonster from "./monster.js"

const scene = {
    preload: function () {
        // load tiles ...
        this.load.spritesheet('tiles', 'assets/colored.png', { frameWidth: 16, frameHeight: 16, spacing: 1 })
    },
    create: function () {
        dungeon.initialize(this)
        dungeon.player = new PlayerCharacter(15, 15)
        tm.addEntity(dungeon.player)
        tm.addEntity(new BasicMonster(20,20))
        tm.addEntity(new BasicMonster(20,10))
        tm.addEntity(new BasicMonster(76,10))
        tm.addEntity(new BasicMonster(29,24))
        tm.addEntity(new BasicMonster(29,20))
    },
    update: function () {
        if (tm.over()) {
            tm.refresh()
        }
        tm.turn()
    }
}

const config = {
    type: Phaser.AUTO,
    width: 80 * 16,
    height: 50 * 16,
    backgroundColor: "#000",
    parent: "game",
    pixelArt: true,
    zoom: 1,
    scene: scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
}

const game = new Phaser.Game(config)