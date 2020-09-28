import dungeon from "./dungeon.js"
import Sword from "./items/sword.js"

export default class PlayerCharacter {
    constructor(x, y) {
        this.name = "The Player"
        this.movementPoints = 1
        this.actionPoints = 1
        this.healthPoints = 30
        this.cursors = dungeon.scene.input.keyboard.createCursorKeys()
        this.x = x
        this.y = y
        this.tile = 29
        this.moving = false
        this.type = "character"
        this.items = []

        this.items.push(new Sword())
        this.toggleItem(0)

        dungeon.initializeEntity(this)

        dungeon.scene.input.keyboard.on("keyup", (event) => {

            let key = event.key

            if (!isNaN(Number(key))) {

                if (key == 0) {
                    key = 10
                }

                this.toggleItem(key - 1)
            }

        });
    }

    toggleItem(itemNumber) {
        const item = this.items[itemNumber]
        if (item) {
            if (item.weapon) {
                this.items.forEach(i => i.active = i.weapon ? false : i.active)
            }
            item.active = !item.active

            if (item.active) {
                dungeon.log(`${this.name} equips ${item.name}: ${item.description}.`)
                item.equip(itemNumber)
            }
        }
    }

    removeItem(itemNumber) {
        const item = this.items[itemNumber]

        if (item) {           
            this.items.forEach(i => {
                i.UIsprite.destroy()
                delete i.UIsprite
            })
            this.items = this.items.filter(i => i !== item)
            this.refreshUI()
        }

    }

    removeItemByProperty(property, value) {
        this.items.forEach(i => {
            i.UIsprite.destroy()
            delete i.UIsprite
        })
        this.items = this.items.filter(i => i[property] !== value)
        this.refreshUI()
    }

    equippedItems() {
        return this.items.filter(i => i.active)
    }

    attack() {
        const items = this.equippedItems()
        const combineDamage = (total, item) => total + item.damage()

        const damage = items.reduce(combineDamage, 0)
        return damage

    }

    refresh() {
        this.movementPoints = 1
        this.actionPoints = 1
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
                    let entity = dungeon.entityAtTile(newX, newY)

                    if (entity && entity.type == "enemy" && this.actionPoints > 0) {
                        dungeon.attackEntity(this, entity)
                        this.actionPoints -= 1
                    }

                    if (entity && entity.type == "item" && this.actionPoints > 0) {
                        this.items.push(entity)
                        dungeon.itemPicked(entity)
                        dungeon.log(`${this.name} picked ${entity.name}: ${entity.description}`)
                        this.actionPoints -= 1
                    } else {
                        newX = oldX
                        newY = oldY
                    }

                }
                if (newX !== oldX || newY !== oldY) {
                    dungeon.moveEntityTo(this, newX, newY)
                }
            }

            if (this.healthPoints <= 6) {
                this.sprite.tint = Phaser.Display.Color.GetColor(255, 0, 0)
            }

        }

        // update item display
        this.refreshUI()
    }


    over() {
        let isOver = this.movementPoints == 0 && !this.moving

        if (isOver && this.UIheader) {
            this.UIheader.setColor("#cfc6b8")
        } else {
            this.UIheader.setColor("#fff")
        }

        if (this.UIstatsText) {
            this.UIstatsText.setText(`Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`)
        }
        return isOver
    }

    onDestroy() {
        alert("OMG! you died!")
        location.reload()
    }

    createUI(config) {
        this.UIscene = config.scene
        let x = config.x
        let y = config.y
        let accumulatedHeight = 0

        // Character sprite and name
        this.UIsprite = this.UIscene.add.sprite(x, y, "tiles", this.tile).setOrigin(0)

        this.UIheader = this.UIscene.add.text(
            x + 20,
            y,
            this.name,
            {
                font: '16px Arial',
                color: '#cfc6b8'
            })


        // Character stats
        this.UIstatsText = this.UIscene.add.text(
            x + 20,
            y + 20,
            `Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`,
            {
                font: '12px Arial',
                fill: '#cfc6b8'
            })

        accumulatedHeight += this.UIstatsText.height + this.UIsprite.height

        // Inventory screen
        let itemsPerRow = 5
        let rows = 2
        this.UIitems = []

        for (let row = 1; row <= rows; row++) {
            for (let cell = 1; cell <= itemsPerRow; cell++) {
                let rx = x + (25 * cell)
                let ry = y + 50 + (25 * row)
                this.UIitems.push(
                    this.UIscene.add.rectangle(rx, ry, 20, 20, 0xcfc6b8, 0.3).setOrigin(0)
                )
            }
        }

        accumulatedHeight += 90

        // Separator
        this.UIscene.add.line(x + 5, y + 120, 0, 10, 175, 10, 0xcfc6b8).setOrigin(0)

        return accumulatedHeight
    }

    refreshUI() {
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            if (!item.UIsprite) {
                let x = this.UIitems[i].x + 10
                let y = this.UIitems[i].y + 10
                item.UIsprite = this.UIscene.add.sprite(x, y, "tiles", item.tile)
            }
            if (!item.active) {
                item.UIsprite.setAlpha(0.5)
                this.UIitems[i].setStrokeStyle()
            }
            else {
                item.UIsprite.setAlpha(1)
                this.UIitems[i].setStrokeStyle(1, 0xffffff)
            }
        }
    }
}