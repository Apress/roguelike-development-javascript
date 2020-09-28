import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class ScrollOfFireball extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 881
		this.tint = 0xdd0000
		this.attackTile = 335
		this.name = "Scroll of Fireball"
		this.description = "A scroll of fireball. Causes between 1 and 4 of damage. Range is four tiles."
		this.weapon = true
		
		dungeon.initializeEntity(this)
	}

	damage() {
		return Phaser.Math.Between(1, 4)
	}

	range() {
		return 4
	}
}