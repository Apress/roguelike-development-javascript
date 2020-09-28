import dungeon from "./dungeon.js"
import tm from "./turnManager.js"
import PlayerCharacter from "./player.js"
import BasicMonster from "./monster.js"

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
        dungeon.player = new PlayerCharacter(15, 15)

        tm.addEntity(dungeon.player)
        tm.addEntity(new BasicMonster(20, 20))
        tm.addEntity(new BasicMonster(20, 10))
        tm.addEntity(new BasicMonster(76, 10))
        tm.addEntity(new BasicMonster(29, 24))
        tm.addEntity(new BasicMonster(29, 20))

        // Set camera, causes game viewport
        // to shrink on the right side freeing
        // space for the UI scene.
        let camera = this.cameras.main
        camera.setViewport(0, 0, camera.worldView.width-200, camera.worldView.height)
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