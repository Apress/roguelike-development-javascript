const scene = {
    preload: function () {
        this.load.bitmapFont("arcade", "font/arcade.png", "font/arcade.xml");
    },
    create: function () {
        this.helloText = this.add.bitmapText(400, 300, "arcade", "Hello Phaser").setOrigin(0.5);
        this.cursors = this.input.keyboard.createCursorKeys();

    },
    update: function () {
        if (this.cursors.left.isDown) {
            this.helloText.x -= 10;
        }

        if (this.cursors.right.isDown) {
            this.helloText.x += 10;
        }

        if (this.cursors.up.isDown) {
            this.helloText.y -= 10;

        }

        if (this.cursors.down.isDown) {
            this.helloText.y += 10;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000",
    parent: "game",
    pixelArt: true,
    scene: scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);