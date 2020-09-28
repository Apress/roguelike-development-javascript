import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class Hammer extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 933
		this.name = "A warhammer"
		this.description = "A basic warhammer. Causes between 3 and 8 damage."
		this.weapon = true
		
		dungeon.initializeEntity(this)

	}

	damage() {
		return Phaser.Math.Between(3, 8)
	}
}