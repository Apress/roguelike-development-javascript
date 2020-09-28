import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class Amulet extends GenericItem {
	constructor(x,y) {
		super(x,y)
		this.tile = 942
		this.name = "Amulet"
		this.description = "The Amulet of Nano Dungeon."
		this.actionPoints = 1

		dungeon.initializeEntity(this)

	}

	turn() {
		if (dungeon.player.items.includes(this)) {
			dungeon.questComplete()
		}

		this.actionPoints = 0

	}

	refresh() {
		this.actionPoints = 1
	}

	over() {
		return this.actionPoints == 0
	}
}