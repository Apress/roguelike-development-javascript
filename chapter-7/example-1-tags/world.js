import dungeon from "./dungeon.js"
import tm from "./turnManager.js"
import classes from "./classes.js"
import { getRandomItem } from "./items.js"
import { getRandomEnemy } from "./enemies.js"

const world = {
    key: "world-scene",
    active: true,
    preload: function () {
        this.load.spritesheet('tiles', 'assets/colored_transparent.png',
            {
                frameWidth: 16,
                frameHeight: 16,
                spacing: 1
            })
    },
    create: function () {
        dungeon.initialize(this)

        // Load game entities
        dungeon.player = new classes.Elf(15, 15)

        tm.addEntity(dungeon.player)
        let monsterCount = 10
        while(monsterCount > 0) {
            let tile = dungeon.randomWalkableTile()
            tm.addEntity(getRandomEnemy(tile.x, tile.y))
            monsterCount--
        }

        let itemCount = 10
        while(itemCount > 0) {
            let tile = dungeon.randomWalkableTile()
            tm.addEntity(getRandomItem(tile.x, tile.y))
            itemCount--
        }
        


        // Set camera, causes game viewport
        // to shrink on the right side freeing
        // space for the UI scene.
        let camera = this.cameras.main
        camera.setViewport(0, 0, camera.worldView.width - 200, camera.worldView.height)
        camera.setBounds(0, 0, camera.worldView.width, camera.worldView.height)
        camera.startFollow(dungeon.player.sprite)


        // Trigger UI scene construction
        this.events.emit('createUI')
    },
    update: function () {
        if (tm.over()) {
            tm.refresh()
        }
        tm.turn()
    }
}

export default world