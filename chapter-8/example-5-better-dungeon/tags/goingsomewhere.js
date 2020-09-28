import dungeon from "../dungeon.js"

const goingSomewhere = {
    name: "Going Somewhere",
    initialize: function () {
        if (this.type === "enemy") {
            this.tint = 0xdd0000

            if (this.sprite) {
                this.sprite.tint = this.tint
                this.sprite.tintFill = true
            }
        }
    },

    turn() {
        let oldX = this.x
        let oldY = this.y
        let dX = this._destinationX
        let dY = this._destinationY

        if (!dX || !dY ) {
            let randomCoords = dungeon.randomWalkableTile()
            this._destinationX = randomCoords.x
            this._destinationY = randomCoords.y
            dX = this._destinationX
            dY = this._destinationY
        }

        if (oldX == dX && oldY == dY) {
            // arrived at destination, find new target.
            let randomCoords = dungeon.randomWalkableTile()
            this._destinationX = randomCoords.x
            this._destinationY = randomCoords.y
            dX = this._destinationX
            dY = this._destinationY
        }

        console.log(`${this.name} going to ${dX},${dY}`)
        
        let grid = new PF.Grid(dungeon.level)
        let finder = new PF.AStarFinder()
        let path = finder.findPath(oldX, oldY, dX, dY, grid)

        if (this.movementPoints > 0) {
            if (path.length > 1) {
                dungeon.moveEntityTo(this, path[1][0], path[1][1])
            }

            this.movementPoints -= 1
        }

        // If the player is near, go after them.
        if (dungeon.distanceBetweenEntities(this, dungeon.player) <= 5) {
            this._destinationX = dungeon.player.x
            this._destinationY = dungeon.player.y
        }

        // Attack player if you can
        if (this.actionPoints > 0) {
            if (dungeon.distanceBetweenEntities(this, dungeon.player) <= 2) {
                dungeon.attackEntity(this, dungeon.player, this.weapon)
            }

            this.actionPoints -= 1
        }
    },

    refresh() {
        if (dungeon.distanceBetweenEntities(this, dungeon.player) <= 5) {
            dungeon.log(`${this.name} grrrr!!!`)
        }
    }

}

export default goingSomewhere