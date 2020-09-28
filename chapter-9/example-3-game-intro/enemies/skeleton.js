import dungeon from "../dungeon.js"
import BasicEnemy from "./basicEnemy.js"

export default class Skeleton extends BasicEnemy {
    constructor(x, y) {
        super(x, y)
        this.name = `Skeleton`
        this.movementPoints = 3
        this.actionPoints = 1
        this.healthPoints = 4
        this.refreshRates = {
            movementPoints: 3,
            actionPoints: 1,
            healthPoints: 0
        }

        this.damage = {
            max: 4,
            min: 1
        }
        
        this.x = x
        this.y = y
        this.tile = 26
        this.type = "enemy"
        this.weapon.name = "pike"

        dungeon.initializeEntity(this)
    }

}