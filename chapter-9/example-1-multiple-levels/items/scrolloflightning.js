import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class ScrollOfLightning extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 881
		this.tint = 0x0022ff
		this.attackTile = 413
		this.name = "Scroll of Lightning"
		this.description = "A scroll of Lightning. Causes between 1 and 2 of damage. Range is seven tiles."
		this.weapon = true
		
		dungeon.initializeEntity(this)
	}

	damage() {
		return Phaser.Math.Between(1, 2)
	}

	range() {
		return 7
	}
}