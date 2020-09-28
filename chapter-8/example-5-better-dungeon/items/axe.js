import GenericItem from "./genericItem.js"

import dungeon from "../dungeon.js"

export default class Axe extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 934
		this.name = "Axe"
		this.description = "A basic axe."
		this.weapon = true
		
		dungeon.initializeEntity(this)

	}

	damage() {
		return Phaser.Math.Between(2, 7)
	}
}