import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class Hammer extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 933
		this.name = "Warhammer"
		this.description = "A basic warhammer."
		this.weapon = true
		
		dungeon.initializeEntity(this)

	}

	damage() {
		return Phaser.Math.Between(3, 8)
	}
}