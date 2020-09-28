import dungeon from "./dungeon.js"
import BSPDungeon from "./bspdungeon.js"

const world = {
    key: "world-scene",
    active: true,
    preload: function () {
        this.load.spritesheet('tiles', './assets/colored_transparent.png',
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

        let camera = this.cameras.main
        camera.setViewport(0, 0, camera.worldView.width, camera.worldView.height)
        camera.setBounds(0, 0, camera.worldView.width, camera.worldView.height)

        dg.tree.forEachArea(a => {
            let x = dungeon.map.tileToWorldX(a.x)
            let y = dungeon.map.tileToWorldY(a.y)
            let w = a.w * 16
            let h = a.h * 16
            this.add.rectangle(x, y, w, h).setStrokeStyle(4, 0xff0000, 1, 0.7).setOrigin(0)
        })
    },
    update: function () {

    }
}

export default world