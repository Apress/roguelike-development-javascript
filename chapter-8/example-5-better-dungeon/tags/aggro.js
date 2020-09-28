
const aggro = {
    name: "Aggro",
    initialize: function () {
        if (this.type === "enemy") {
            this.tint = 0x00bc00
            this.refreshRates.actionPoints += 2

            if (this.sprite) {
                this.sprite.tint = this.tint
                this.sprite.tintFill = true
            }
        }
    }
}

export default aggro