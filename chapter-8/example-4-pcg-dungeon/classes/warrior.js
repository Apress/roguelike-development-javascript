import BasicHero from "./basicHero.js"
import Sword from "../items/sword.js"
import dungeon from "../dungeon.js"


export default class Warrior extends BasicHero {
    constructor(x, y) {
        super(x, y)

        this.name = "Warrior"
        this.movementPoints = 3
        this.actionPoints = 2

        this.items.push(new Sword())
        this.toggleItem(0)

        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 3
        this.actionPoints = 2
    }
}