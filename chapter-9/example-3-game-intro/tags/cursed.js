import dungeon from "../dungeon.js"

const cursed = {
    name: "Cursed",
    initialize: function (damage = 1, howManyTurns = 5) {
        this._curseDamage = damage
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
            if (this._howManyTurns > 0 && !this._curseActivated) {
                this._curseActivated = true
                this.healthPoints -= this._curseDamage
                this._howManyTurns -= 1
                dungeon.log(`${this.name} suffers ${this._curseDamage} from curse.`)
            }
        }
        
        if (this._howManyTurns == 0) {
            this.removeTag(cursed)
        }
    },

    refresh() {
        this._curseActivated = false
    },

    damagedEntity(entity) {
        entity.addTag(cursed)
        return entity
    }

}

export default cursed