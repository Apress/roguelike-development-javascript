import dungeon from "../dungeon.js"
import BasicHero from "./basicHero.js"
import Hammer from "../items/hammer.js"

export default class Cleric extends BasicHero {
    constructor(x, y) {
        super(x, y)

        this.name = "Cleric"
        this.movementPoints = 3
        this.actionPoints = 2
        this.healthPoints = 40
        this.tile = 30

        this.items.push(new Hammer())
        this.toggleItem(0)

        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 3
        this.actionPoints = 2

        // Clerics heal a bit every turn
        if (this.healthPoints < 40) {
            this.healthPoints += 1
            dungeon.log("Cleric heals 1 hp")
        }
    }
}