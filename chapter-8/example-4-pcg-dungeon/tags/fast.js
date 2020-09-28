
const fast = {
    name: "Fast",
    initialize: function () {
        if (this.type === "enemy") {
            this.tint = 0x00bb00
            this.refreshRates.movementPoints += 2

            if (this.sprite) {
                this.sprite.tint = this.tint
                this.sprite.tintFill = true
            }
        }
    }
}

export default fast