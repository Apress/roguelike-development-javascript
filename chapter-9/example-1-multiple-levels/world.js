import dungeon from "./dungeon.js"
import tm from "./turnManager.js"
import classes from "./classes.js"
import { getRandomItem } from "./items.js"
import { getRandomEnemy } from "./enemies.js"
import Stairs from "./items/stairs.js"


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
        this.events.once('dungeon-changed', () => {
            this.scene.restart()
        })

        dungeon.initialize(this)

        // get rooms
        let rooms = dungeon.rooms

        // Add stairs
        let stairs = dungeon.stairs
        if (stairs.down) {
            tm.addEntity(new Stairs(stairs.down.x, stairs.down.y, "down"))
        }
        if (stairs.up) {
            tm.addEntity(new Stairs(stairs.up.x, stairs.up.y, "up"))
        }

        // Place player in the room at the 
        // left-most tree node. 
        let node = dungeon.tree.left
        while (node.left !== false) {
            node = node.left
        }
        let r = node.area.room
        let p = dungeon.randomWalkableTileInRoom(r.x, r.y, r.w, r.h)

        if (!dungeon.player) {
            dungeon.player = new classes.Elf(p.x, p.y)
        } else {
            dungeon.player.x = p.x
            dungeon.player.y = p.y
            dungeon.player.refresh()
            dungeon.initializeEntity(dungeon.player)
        }

        tm.addEntity(dungeon.player)

        rooms.forEach(room => {
            let monsterCount = 0
            let itemCount = 0

            let roomType = Phaser.Math.RND.weightedPick([0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3])

            switch (roomType) {
                case 0:
                    // empty room.
                    monsterCount = 0
                    itemCount = 0
                    break
                case 1:
                    // a monster.
                    monsterCount = 1
                    itemCount = 0
                    break
                case 2:
                    // monster and items.
                    monsterCount = 2
                    itemCount = 1
                    break
                case 3:
                    // treasure room.
                    monsterCount = 0
                    itemCount = 5
                    break
            }

            while (monsterCount > 0) {
                let tile = dungeon.randomWalkableTileInRoom(room.x, room.y, room.w, room.h)
                tm.addEntity(getRandomEnemy(tile.x, tile.y))
                monsterCount--
            }

            while (itemCount > 0) {
                let tile = dungeon.randomWalkableTileInRoom(room.x, room.y, room.w, room.h)
                tm.addEntity(getRandomItem(tile.x, tile.y))
                itemCount--
            }
        })

        // Set camera, causes game viewport
        // to shrink on the right side freeing
        // space for the UI scene.
        let camera = this.cameras.main
        camera.setViewport(0, 0, dungeon.map.displayWidth - 220, dungeon.map.displayHeight)
        camera.setBounds(0, 0, this.game.config.width, this.game.config.height)
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