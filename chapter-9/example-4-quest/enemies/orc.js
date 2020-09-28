import dungeon from "../dungeon.js"
import BasicEnemy from "./basicEnemy.js"

export default class Orc extends BasicEnemy {
    constructor(x, y) {
        super(x, y)
        this.name = `Orc`
        this.movementPoints = 2
        this.actionPoints = 1
        this.healthPoints = 4
        this.refreshRates = {
            movementPoints: 2,
            actionPoints: 1,
            healthPoints: 0
        }

        this.damage = {
            max: 5,
            min: 2
        }
        
        this.x = x
        this.y = y
        this.tile = 57
        this.type = "enemy"
        this.weapon.name = "club"

        dungeon.initializeEntity(this)
    }

}