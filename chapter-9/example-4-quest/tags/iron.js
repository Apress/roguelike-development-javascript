const iron = {
    name: "Iron",
    initialize: function () {
        this.name = `Iron ${this.name}`
        this.tint = 0xccbc00

        if (this.sprite) {
            this.sprite.tint = this.tint
            this.sprite.tintFill = true
        }
    },

    attack(acc = 0) {
        if (acc > 0) {
            acc += 1
        }
        return acc
    },

    protection(acc = 0) {
        if (acc > 0) {
            acc += 1
        }
        return acc
    }
}

export default iron