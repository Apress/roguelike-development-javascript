import level from "./room1.js"

const scene = {
    preload: function () {
        // load tiles ...
        this.load.spritesheet('tiles', 'assets/colored.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    },
    create: function () {
        // Just convert the walls from 1 to 554.
        const wall = 554
        const floor = 0
        let mappedLevel = level.map(r => r.map(t => t == 1 ? wall : floor))

        // Draw the tilemap
        const tileSize = 16
        const config = {
            data: mappedLevel,
            tileWidth: tileSize,
            tileHeight: tileSize,
        }
        const map = this.make.tilemap(config);
        const tileset = map.addTilesetImage('tiles', 'tiles', tileSize, tileSize, 0, 1); // key: texture key
        const ground = map.createStaticLayer(0, tileset, 0, 0);

    },
    update: function () {
    }
}

const config = {
    type: Phaser.AUTO,
    width: 80 * 16,
    height: 50 * 16,
    backgroundColor: "#000",
    parent: "game",
    pixelArt: true,
    zoom: 1,
    scene: scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);