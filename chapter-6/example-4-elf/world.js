import dungeon from "./dungeon.js"
import tm from "./turnManager.js"
import classes from "./classes.js"
import Skeleton from "./enemies/skeleton.js"
import CursedGem from "./items/cursedGem.js"
import Gem from "./items/gem.js"
import LongSword from "./items/longSword.js"
import Potion from "./items/potion.js"

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
        tm.addEntity(new Skeleton(20, 20))
        tm.addEntity(new Skeleton(20, 10))
        tm.addEntity(new CursedGem(15, 20))
        tm.addEntity(new Potion(18, 18))
        tm.addEntity(new LongSword(18, 22))
        tm.addEntity(new Gem(21, 21))
        tm.addEntity(new Skeleton(76, 10))
        tm.addEntity(new Skeleton(29, 24))
        tm.addEntity(new Skeleton(29, 20))


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