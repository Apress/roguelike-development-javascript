import dungeon from "../dungeon.js"

const burning = {
    name: "Burning",
    initialize: function (damage = 2, howManyTurns = 3) {
        this._burnDamage = damage
        this._howManyTurns = howManyTurns
        if (this.type === "item") {
            this.tint = 0x002300

            if (this.sprite) {
                this.sprite.tint = this.tint
                this.sprite.tintFill = true
            }
        }
    },
    turn() {
        if (this.type !== "item") {
            if (this._howManyTurns > 0 && !this._burningActivated) {
                this._burningActivated = true
                this.healthPoints -= this._burnDamage
                this._howManyTurns -= 1
                dungeon.log(`${this.name} suffers ${this._burnDamage} hits from burning.`)
            }

            if (this._howManyTurns == 0) {
                this.removeTag(burning)
            }
        }
    },

    refresh() {
        this._burningActivated = false
    },

    damagedEntity(entity) {
        entity.addTag(burning)
        return entity
    }

}

export default burning