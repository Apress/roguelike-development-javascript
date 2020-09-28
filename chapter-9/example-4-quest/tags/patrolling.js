import dungeon from "../dungeon.js"

const patrolling = {
    name: "Patrolling",
    initialize: function () {
        if (this.type === "enemy") {
            this.tint = 0xdd00cd

            if (this.sprite) {
                this.sprite.tint = this.tin
                this.sprite.tintFill = true
            }

            this._initialX = this.x
            this._initialY = this.y

            let randomCoords = dungeon.randomWalkableTile()
            this._destinationX = randomCoords.x
            this._destinationY = randomCoords.y

            this._targetX = this._destinationX
            this._targetY = this._destinationY
        }
    },

    turn() {
        let oldX = this.x
        let oldY = this.y

        if (oldX == this._initialX && oldY == this._initialY) {
            // arrived at destination, find new target.
            this._targetX = this._destinationX
            this._targetY = this._destinationY
        }

        if (oldX == this._destinationX && oldY == this._destinationY) {
            // arrived at destination, find new target.
            this._targetX = this._initialX
            this._targetY = this._initialY
        }

        console.log(`${this.name} patrolling to ${this._targetX},${this._targetY}`)
        
        let grid = new PF.Grid(dungeon.level)
        let finder = new PF.AStarFinder()
        let path = finder.findPath(oldX, oldY, this._targetX, this._targetY, grid)

        if (this.movementPoints > 0) {
            if (path.length > 1) {
                dungeon.moveEntityTo(this, path[1][0], path[1][1])
            }

            this.movementPoints -= 1
        }

        // If the player is near, go after them.
        if (dungeon.distanceBetweenEntities(this, dungeon.player) <= 5) {
            this._targetX = dungeon.player.x
            this._targetX = dungeon.player.y
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
            dungeon.log(`${this.name} raaawwrr!!!`)
        }
    }

}

export default patrolling