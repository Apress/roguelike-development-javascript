import dungeon from "../dungeon.js"
import BasicHero from "./basicHero.js"
import Axe from "../items/axe.js"
import Shield from "../items/shield.js"
import Golden from "../tags/golden.js"

export default class Dwarf extends BasicHero {
    constructor(x, y) {
        super(x, y)

        this.name = "Dwarf"
        this.movementPoints = 2
        this.actionPoints = 2
        this.healthPoints = 35
        this.tile = 61

        this.items.push(new Axe())
        this.toggleItem(0)

        this.items.push(new Shield().addTag(Golden))
        this.toggleItem(1)

        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 2
        this.actionPoints = 2
    }
}