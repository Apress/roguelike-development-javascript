import dungeon from "./dungeon.js"

export default class BasicMonster {
    constructor(x, y) {
        this.name = "A Dangerous Monster"
        this.movementPoints = 1
        this.actionPoints = 3
        this.healthPoints = 1
        this.x = x
        this.y = y
        this.tile = 26
        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 1
        this.actionPoints = 3
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
        return this.movementPoints == 0 && this.actionPoints == 0 && !this.moving
    }

    onDestroy() {
        console.log(`${this.name} was killed`)
    }
}