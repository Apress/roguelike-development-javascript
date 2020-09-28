import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class Bow extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 901
		this.attackTile = 872
		this.name = "A Bow"
		this.description = "A bow and arrows. Causes between 1 and 3 damage. Range is five tiles."
		this.weapon = true
		
		dungeon.initializeEntity(this)

	}

	damage() {
		return Phaser.Math.Between(1, 3)
	}

	range() {
		return 5
	}
}