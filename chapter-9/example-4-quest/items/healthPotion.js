import GenericItem from "./genericItem.js"
import dungeon from "../dungeon.js"

export default class HealthPotion extends GenericItem {
	constructor(x,y) {
		super(x,y)
		this.tile = 761
		this.name = "Health Potion"
		this.description = "A potion that cures between 3 and 5 health points when."

		dungeon.initializeEntity(this)

	}
    
    equip(itemNumber) {
    	const points = Phaser.Math.Between(3, 5)
        dungeon.log(`A warm feeling is felt when drinking the potion as it restores ${points} health points.`)
        dungeon.player.healthPoints += points
        dungeon.player.removeItem(itemNumber)
    }
}