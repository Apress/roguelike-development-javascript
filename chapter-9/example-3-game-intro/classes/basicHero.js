import dungeon from "../dungeon.js"
import Taggable from "../taggable.js"

export default class BasicHero extends Taggable {
    constructor(x, y) {
        super(x,y)
        this.name = "The Hero"
        this.movementPoints = 1
        this.actionPoints = 1
        this.healthPoints = 30
        this.x = x
        this.y = y
        this.tile = 29
        this.moving = false
        this.type = "character"
        this.items = []
    }

    setEvents() {
        dungeon.scene.input.keyboard.addCapture(["SPACE", "UP","DOWN","LEFT","RIGHT"])
        dungeon.scene.input.keyboard.on("keyup", (event) => {
            if (!this.over()) {
                this.processInput(event)
            }
            event.stopPropagation()
        });

        dungeon.scene.input.on("pointerup", (event) => {
            if (!this.over()) {
                this.processTouchInput(event)
            }
        });
    }

    turn() {
        if (this.healthPoints <= 6) {
            this.sprite.tint = Phaser.Display.Color.GetColor(255, 0, 0)
        }

        // update item display
        this.refreshUI()
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
                item.equip(itemNumber, this)
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

    currentWeapon() {
        const items = this.equippedItems()
        const weapon = items.find(w => w.weapon)
        return weapon
    }

    attack() {
        const items = this.equippedItems()
        const combinedDamage = (total, item) => total + item.damage()

        const damage = items.reduce(combinedDamage, 0)
        return damage

    }

    protection() {
        const items = this.equippedItems()
        const combinedProtection = (total, item) => total + item.protection()

        const protection = items.reduce(combinedProtection, 0)
        return protection
    }

    refresh() {
        this.movementPoints = 1
        this.actionPoints = 1
    }

    processTouchInput(event) {
        let x = dungeon.map.worldToTileX(event.worldX)
        let y = dungeon.map.worldToTileY(event.worldY)

        let entity = dungeon.entityAtTile(x, y)

        if (entity && entity.type == "enemy" && this.actionPoints > 0) {
            const currentWeapon = this.currentWeapon()
            const rangedAttack = currentWeapon.range() > 0 ? currentWeapon.attackTile || currentWeapon.tile : false
            const tint = currentWeapon.tint || false
            const distance = dungeon.distanceBetweenEntities(this, entity)
            if (rangedAttack && distance <= currentWeapon.range()) {
                dungeon.attackEntity(this, entity, currentWeapon)
                this.actionPoints -= 1
            }
        }
    }

    processInput(event) {
        let oldX = this.x
        let oldY = this.y
        let moved = false
        let newX = this.x
        let newY = this.y

        let key = event.key

        // Equip items
        if (!isNaN(Number(key))) {

            if (key == 0) {
                key = 10
            }

            this.toggleItem(key - 1)
        }
        
        // go down the dungeon
        if (event.key == "d") {
            dungeon.goDown()
            return
        }

        // go up the dungeon
        if (event.key == "u") {
            dungeon.goUp()
            return
        }

        // Pass the turn
        if (event.keyCode == 32) {
            this.movementPoints = 0
            this.actionPoints = 0
        }

        // Movement decision
        if (event.key == "ArrowLeft") {
            newX -= 1
            moved = true
        }

        if (event.key == "ArrowRight") {
            newX += 1
            moved = true
        }

        if (event.key == "ArrowUp") {
            newY -= 1
            moved = true
        }

        if (event.key == "ArrowDown") {
            newY += 1
            moved = true
        }

        // Execute movement
        if (moved) {
            this.movementPoints -= 1

            if (!dungeon.isWalkableTile(newX, newY)) {
                let entity = dungeon.entityAtTile(newX, newY)

                // Check if entity at destination is an enemy
                if (entity && entity.type == "enemy" && this.actionPoints > 0) {
                    const currentWeapon = this.currentWeapon()
                    const rangedAttack = currentWeapon.range() > 0 ? currentWeapon.attackTile || currentWeapon.tile : false
                    const tint = currentWeapon.tint || false
                    dungeon.attackEntity(this, entity, currentWeapon)
                    this.actionPoints -= 1
                    this.movementPoints += 1
                }

                // Check if entity at destination is an item
                if (entity && entity.type == "item" && this.actionPoints > 0) {
                    this.items.push(entity)
                    dungeon.itemPicked(entity)
                    dungeon.log(`${this.name} picked ${entity.name}: ${entity.description}`)
                    this.actionPoints -= 1
                } else {
                    newX = oldX
                    newY = oldY
                }

                // Check if entity at destination is a stair
                if (entity && entity.type == "stairs" ) {
                    if (entity.direction == "down") {
                        dungeon.goDown()
                    } else {
                        dungeon.goUp()
                    }
                }

            }


            if (newX !== oldX || newY !== oldY) {
                dungeon.moveEntityTo(this, newX, newY)
            }
        }
    }


    over() {
        let isOver = this.movementPoints <= 0 && !this.moving

        if (isOver && this.UIheader) {
            this.UIheader.setColor("#cfc6b8")
            this.actionPoints = 0
        } else {
            this.UIheader.setColor("#fff")
        }

        return isOver
    }

    onDestroy() {
        dungeon.gameOver()
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
                item.UIsprite = this.UIscene.add.sprite(x, y, "tiles", item.tile).setInteractive({ useHandCursor: true })
                item.UIsprite.on("pointerup", pointer => {
                    if (pointer.leftButtonReleased()) {
                        dungeon.describeEntity(item)
                    }
                })
                if (item.tint) {
                    item.UIsprite.tint = item.tint
                    item.UIsprite.tintFill = true
                }
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

        if (this.UIstatsText) {
            this.UIstatsText.setText(`Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`)
        }
        
    }

    cleanup() {
        delete this.UIheader
        delete this.UIstatsText
        delete this.UIsprite
        delete this.UIitems
        delete this.UIscene
        delete this.sprite
        this.items.forEach(i => {
            if (i.UIsprite) {
                delete i.UIsprite
            }
        })
    }
}