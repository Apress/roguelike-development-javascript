import GenericItem from "./genericItem.js"

import dungeon from "../dungeon.js"

export default class Axe extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 934
		this.name = "An Axe"
		this.description = "A basic axe. Causes between 2 and 7 damage."
		this.weapon = true
		
		dungeon.initializeEntity(this)

	}

	damage() {
		return Phaser.Math.Between(2, 7)
	}
}