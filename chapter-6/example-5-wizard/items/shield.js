import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class Sword extends GenericItem {
	constructor(x, y) {
		super(x,y)
		this.tile = 776
		this.name = "A Shield"
		this.description = "A basic shield. Gives +1 protection."
		
		dungeon.initializeEntity(this)
	}

	protection() {
		return 1
	}
}