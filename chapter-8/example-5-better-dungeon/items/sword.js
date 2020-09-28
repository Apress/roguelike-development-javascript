import GenericItem from "./genericItem.js"

import dungeon from "../dungeon.js"

export default class Sword extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 994
		this.name = "Sword"
		this.description = "A basic sword. Causes between 1 and 5 of damage."
		this.weapon = true
		
		dungeon.initializeEntity(this)

	}

	damage() {
		return Phaser.Math.Between(1, 5)
	}

	range() {
		return 0
	}
}