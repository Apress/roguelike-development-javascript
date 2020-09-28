import dungeon from "../dungeon.js"

const hunter = {
    name: "Hunter",
    initialize: function () {
        if (this.type === "enemy") {
            this.tint = 0xe3e3e3

            if (this.sprite) {
                this.sprite.tint = this.tint
            }
        }
    },
    turn() {
        let oldX = this.x
        let oldY = this.y
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
                dungeon.attackEntity(this, dungeon.player, this.weapon)
            }

            this.actionPoints -= 1
        }
    }
}

export default hunter