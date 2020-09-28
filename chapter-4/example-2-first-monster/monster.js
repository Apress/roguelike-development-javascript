import dungeon from "./dungeon.js"

export default class BasicMonster {
    constructor(x, y) {
        this.movementPoints = 1
        this.x = x
        this.y = y
        this.tile = 26
        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 1
    }

    turn() {
        let oldX = this.x
        let oldY = this.y
    
        if (this.movementPoints > 0) {
            // https://github.com/qiao/PathFinding.js
            let pX = dungeon.player.x
            let pY = dungeon.player.y
            let grid = new PF.Grid(dungeon.level)
            let finder = new PF.AStarFinder()
            let path = finder.findPath(oldX, oldY, pX, pY, grid)
    
            if (path.length > 2) {
                dungeon.moveEntityTo(this, path[1][0], path[1][1])
            }

            this.movementPoints -= 1
        }
    }

    over() {
        return this.movementPoints == 0 && !this.moving
    }
}