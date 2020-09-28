import level from "./level.js"

let dungeon = {
    sprites: {
        floor: 0,
        wall: 554,
    },
    tileSize: 16,
    initialize: function (scene) {
        this.scene = scene
        this.level = level
        let levelWithTiles = level.map(r => r.map(t => t == 1 ? this.sprites.wall : this.sprites.floor))

        const config = {
            data: levelWithTiles,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
        }
        const map = scene.make.tilemap(config)
        const tileset = map.addTilesetImage('tiles', 'tiles', this.tileSize, this.tileSize, 0, 1) // key: texture key
        this.map = map.createDynamicLayer(0, tileset, 0, 0)
  
    },
    isWalkableTile: function (x, y) {
        return level[y][x] !== 1
    },
    initializeEntity: function(entity) {
        let x = this.map.tileToWorldX(entity.x)
        let y = this.map.tileToWorldY(entity.y)
        entity.sprite = this.scene.add.sprite(x, y, "tiles", entity.tile)
        entity.sprite.setOrigin(0)
    },
    moveEntityTo: function(entity, x, y) {
        entity.moving = true 

        this.scene.tweens.add({
            targets: entity.sprite,
            onComplete: () => {
                entity.moving = false
                entity.x = x
                entity.y = y
            },
            x: this.map.tileToWorldX(x),
            y: this.map.tileToWorldY(y),
            ease: "Power2",
            duration: 200
        })        
    }
}

export default dungeon