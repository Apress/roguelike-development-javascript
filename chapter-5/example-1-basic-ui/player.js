import dungeon from "./dungeon.js"

export default class PlayerCharacter {
    constructor(x, y) {
        this.name = "The Player"
        this.movementPoints = 1
        this.actionPoints = 1
        this.healthPoints = 15
        this.cursors = dungeon.scene.input.keyboard.createCursorKeys()
        this.x = x
        this.y = y
        this.tile = 29
        this.moving = false

        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 1
        this.actionPoints = 1
    }

    attack() {
        return 1
    }

    turn() {
        let oldX = this.x
        let oldY = this.y
        let moved = false
        let newX = this.x
        let newY = this.y

        if (this.movementPoints > 0) {
            if (this.cursors.left.isDown) {
                newX -= 1
                moved = true
            }

            if (this.cursors.right.isDown) {
                newX += 1
                moved = true
            }

            if (this.cursors.up.isDown) {
                newY -= 1
                moved = true
            }

            if (this.cursors.down.isDown) {
                newY += 1
                moved = true
            }

            if (moved) {
                this.movementPoints -= 1

                if (!dungeon.isWalkableTile(newX, newY)) {
                    let enemy = dungeon.entityAtTile(newX, newY)

                    if (enemy && this.actionPoints > 0) {
                        dungeon.attackEntity(this, enemy)
                        this.actionPoints -= 1
                    }

                    newX = oldX
                    newY = oldY
                }
                if (newX !== oldX || newY !== oldY) {
                    dungeon.moveEntityTo(this, newX, newY)
                }
            }

            if (this.healthPoints <= 6) {
                this.sprite.tint = Phaser.Display.Color.GetColor(255, 0, 0)
            }

        }
    }

    over() {
        let isOver = this.movementPoints == 0 && !this.moving

        if (isOver && this.UIHeader) {
            this.UIHeader.setColor("#cfc6b8")
        } else {
            this.UIHeader.setColor("#fff")
        }

        if (this.UIStatsText) {
            this.UIStatsText.setText( `Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`)
        }
        return isOver
    }

    onDestroy() {
        alert("OMG! you died!")
        location.reload()
    }

    createUI(config) {
        let scene = config.scene
        let x = config.x
        let y = config.y
        let accumulatedHeight = 0

        // Character sprite and name
        this.UIsprite = scene.add.sprite(x, y, "tiles", this.tile).setOrigin(0)

        this.UIHeader = scene.add.text(
            x + 20, 
            y, 
            this.name, 
            { 
                font: '16px Arial', 
                color: '#cfc6b8' 
            })


        // Character stats
        this.UIStatsText = scene.add.text(
            x + 20, 
            y + 20, 
            `Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`, 
            { 
                font: '12px Arial', 
                fill: '#cfc6b8' 
            })

        accumulatedHeight += this.UIStatsText.height + this.UIsprite.height

        // Inventory screen
        let itemsPerRow = 5
        let rows = 2
        this.UIitems = []

        for (let row = 1; row <= rows; row++) {
            for (let cell = 1; cell <= itemsPerRow; cell++) {
                let rx = x + (25 * cell)
                let ry = y + 50 + (25 * row)
                this.UIitems.push(
                    scene.add.rectangle(rx, ry, 20, 20, 0xcfc6b8, 0.3).setOrigin(0)
                )
            }
        }

        accumulatedHeight += 90

        // Separator
        scene.add.line(x+5, y+120, 0, 10, 175, 10, 0xcfc6b8).setOrigin(0)

        return accumulatedHeight
    }
}