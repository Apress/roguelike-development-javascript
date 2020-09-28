import dungeon from "./dungeon.js"
import tm from "./turnManager.js"

const ui = {
    key: "ui-scene",
    active: false,
    create: function () {
        this.createdUI = false

        this.scene.get('world-scene').events.once('dungeon-changed', () => {
            this.scene.restart()
        })


        this.scene.get('world-scene').events.once('createUI', () => {
            let iterator = tm.entities.values()
            let x = (80 * 16) - 190
            let y = 10

            for (let entity of iterator) {
                if (typeof entity.createUI === "function") {
                    let height = entity.createUI({
                        scene: this,
                        x,
                        y,
                        width: 198
                    })

                    y += height
                }
            }

            this.add.line(x+5, y, 0, 10, 175, 10, 0xcfc6b8).setOrigin(0)

            this.log = this.add.text(x+10, y+20, "", {
                font: '12px Arial',
                color: '#cfc6b8',
                wordWrap: {
                    width: 180
                }
            })

            this.createdUI = true
            dungeon.ui = this
        })
    },
    update: function() {
        if (this.createdUI) {  
            let text = dungeon.msgs.join(`\n\n`)
            this.log.setText(text)
        }
    }
}

export default ui