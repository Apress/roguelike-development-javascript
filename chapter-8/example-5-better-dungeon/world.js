import dungeon from "./dungeon.js"
import tm from "./turnManager.js"
import classes from "./classes.js"
import { getRandomItem } from "./items.js"
import { getRandomEnemy } from "./enemies.js"
import BSPDungeon from "./bspdungeon.js"

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
        let dg = new BSPDungeon(80, 50, 4)
        let level = dg.toLevelData()
        dungeon.initialize(this, level)

        // get rooms
        let rooms = dg.getRooms()

        // Place player in the room at the 
        // left-most tree node. 
        let node = dg.tree.left
        while (node.left !== false) {
            node = node.left
        }
        let r = node.area.room
        let p = dungeon.randomWalkableTileInRoom(r.x, r.y, r.w, r.h)
        dungeon.player = new classes.Elf(p.x, p.y)

        tm.addEntity(dungeon.player)
            rooms.forEach(room => {
                let area = room.w * room.h

                let monsterCount = 0
                let itemCount = 0

                let roomType = Phaser.Math.RND.weightedPick([0,0,0,0,1,1,1,1,1,1,2,2,2,2,3])

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

                while(monsterCount > 0) {
                    let tile = dungeon.randomWalkableTileInRoom(room.x, room.y, room.w, room.h)
                    tm.addEntity(getRandomEnemy(tile.x, tile.y))
                    monsterCount--
                }

                while(itemCount > 0) {
                    let tile = dungeon.randomWalkableTileInRoom(room.x, room.y, room.w, room.h)
                    tm.addEntity(getRandomItem(tile.x, tile.y))
                    itemCount--
                }
            })
        


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