import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class Stairs extends GenericItem {
	constructor(x, y, direction = "down") {
		super(x,y)
		if (direction == "down") {
			this.tile = 195
		} else {
			this.tile = 194
		}
		this.name = "Stairs"
		this.type =  "stairs"
		this.direction = direction
		
		dungeon.initializeEntity(this)

	}
}