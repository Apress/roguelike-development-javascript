import dungeon from "../dungeon.js"

export default class Skeleton {
    constructor(x, y) {
        this.name = "Skeleton"
        this.movementPoints = 1
        this.actionPoints = 1
        this.healthPoints = 4
        this.x = x
        this.y = y
        this.tile = 26
        this.type = "enemy"

        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 1
        this.actionPoints =1
    }

    attack() {
        return 1
    }

    turn() {
        let oldX = this.x
        let oldY = this.y

        // https://github.com/qiao/PathFinding.js
        let pX = dungeon.player.x
        let pY = dungeon.player.y
        let grid = new PF.Grid(dungeon.level)
        let finder = new PF.AStarFinder()
        let path = finder.findPath(oldX, oldY, pX, pY, grid)

        if (this.movementPoints > 0) {
            if (path.length > 2) {
                dungeon.moveEntityTo(this, path[1][0], path[1][1])
            }

            this.movementPoints -= 1
        }

        if (this.actionPoints > 0) {
            if (dungeon.distanceBetweenEntities(this, dungeon.player) <= 2) {
                dungeon.attackEntity(this, dungeon.player)
            }

            this.actionPoints -= 1
        }
    }

    over() {
        let isOver = this.movementPoints == 0 && this.actionPoints == 0 && !this.moving
        if (isOver && this.UItext) {
            this.UItext.setColor("#cfc6b8")
        } else {
            this.UItext.setColor("#fff")
        }
       
        return isOver
    }

    onDestroy() {
        dungeon.log(`${this.name} was killed.`)
        this.UIsprite.setAlpha(0.2)
        this.UItext.setAlpha(0.2)
    }

    createUI(config) {
        let scene = config.scene
        let x = config.x
        let y = config.y

        this.UIsprite = scene.add.sprite(x, y, "tiles", this.tile).setOrigin(0)
        this.UItext = scene.add.text(x+20, y, this.name, { font: '16px Arial', fill: '#cfc6b8' })

        return 30
    }
}