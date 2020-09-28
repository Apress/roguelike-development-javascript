import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class Gem extends GenericItem {
	constructor(x,y) {
		super(x,y)

		this.tile = 720
		this.name = "Gem"
		
		dungeon.initializeEntity(this)

	}
}