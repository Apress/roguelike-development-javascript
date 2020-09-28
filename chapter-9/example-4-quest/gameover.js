const gameOver = {
    key: "game-over-scene",
    active: false,
    preload: function () {

    },
    create: function () {
        const x = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const y = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.add.text(
            x,
            y,
            "Game Over",
            {
                font: "120px 'Doomed'",
                color: "#cfc6b8"
            }).setOrigin(0.5)

        this.add.text(
            x,
            y+100,
            "Press any key to go into the dungeon again",
            {
                font: "24px 'Doomed'",
                color: "#cfc6b8"
            }).setOrigin(0.5)

        this.input.keyboard.on("keyup", (event) => {
            location.reload()
        })

    },
    update: function () {

    }
}

export default gameOver