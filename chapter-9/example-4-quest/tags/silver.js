import dungeon from "../dungeon.js"

const silver = {
    name: "Silver",
    initialize: function () {
        this.name = `Silver ${this.name}`
        this.tint = 0xccbc00

        if (this.sprite) {
            this.sprite.tint = this.tint
            this.sprite.tintFill = true
        }

        if (this.type == "item") {
            this.equipHPBonus = 2
        }
    },

    equip(acc, itemNumber, entity) {
        if (this.equipHPBonus > 0) {
            dungeon.log(`+${this.equipHPBonus} health bonus for equipping silver item.`)
            entity.healthPoints += this.equipHPBonus
            this.equipHPBonus = false
        }
    }
}

export default silver