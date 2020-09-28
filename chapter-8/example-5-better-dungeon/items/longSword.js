import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class LongSword extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 992
		this.name = "Long Sword"
		this.description = "A long sword that causes between 1 and 8 of damage."
		this.weapon = true
		
		dungeon.initializeEntity(this)

	}

	damage() {
		return Phaser.Math.Between(4, 8)
	}
}