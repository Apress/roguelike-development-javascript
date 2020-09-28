import dungeon from "../dungeon.js"
import BasicHero from "./basicHero.js"
import ScrollOfFireball from "../items/scrolloffireball.js"
import ScrollOfLightning from "../items/scrolloflightning.js"
import HealthPotion from "../items/healthPotion.js"


export default class Wizard extends BasicHero {
    constructor(x, y) {
        super(x, y)

        this.name = "Wizard"
        this.movementPoints = 3
        this.actionPoints = 1
        this.healthPoints = 20
        this.tile = 88

        this.items.push(new ScrollOfFireball())
        this.items.push(new ScrollOfLightning())
        this.items.push(new HealthPotion())
        this.items.push(new HealthPotion())

        this.toggleItem(1)

        dungeon.initializeEntity(this)
    }

    refresh() {
        this.movementPoints = 3
        this.actionPoints = 1
    }
}