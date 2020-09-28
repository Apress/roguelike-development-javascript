import level from "./level.js"
import tm from "./turnManager.js"

let dungeon = {
    sprites: {
        floor: 0,
        wall: 554,
    },
    tileSize: 16,
    initialize: function (scene) {
        this.scene = scene
        this.level = level
        this.levelWithTiles = level.map(r => r.map(t => t == 1 ? this.sprites.wall : this.sprites.floor))

        const config = {
            data: this.levelWithTiles,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
        }
        const map = scene.make.tilemap(config)
        const tileset = map.addTilesetImage('tiles', 'tiles', this.tileSize, this.tileSize, 0, 1) // key: texture key
        this.map = map.createDynamicLayer(0, tileset, 0, 0)
  
    },
    isWalkableTile: function (x, y) {
        // check all entities.
        let allEntities = [...tm.entities]
        for (let e = 0; e < allEntities.length; e++ ) {
            let entity = allEntities[e]
            if (entity.x == x && entity.y == y) {
                return false
            }
        }
        // check level
        let tileAtDestination = dungeon.map.getTileAt(x, y)
        return tileAtDestination.index !== dungeon.sprites.wall
    },
    entityAtTile: function (x, y) {
        let allEntities = [...tm.entities]
        for (let e = 0; e < allEntities.length; e++ ) {
            let entity = allEntities[e]
            if (entity.x == x && entity.y == y) {
                return entity
            }
        }
        return false
    },
    removeEntity: function(entity) {
        tm.entities.delete(entity)
        entity.sprite.destroy()
        entity.onDestroy()
    },
    initializeEntity: function(entity) {
        let x = this.map.tileToWorldX(entity.x)
        let y = this.map.tileToWorldY(entity.y)
        entity.sprite = this.scene.add.sprite(x, y,"tiles", entity.tile)
        entity.sprite.setOrigin(0)
    },
    moveEntityTo: function(entity, x, y) {
        entity.moving = true 
        entity.x = x
        entity.y = y

        this.scene.tweens.add({
            targets: entity.sprite,
            onComplete: () => {
                entity.moving = false
            },
            x: this.map.tileToWorldX(x),
            y: this.map.tileToWorldY(y),
            ease: "Power2",
            duration: 100
        })        
    },
    distanceBetweenEntities: function(e1, e2) {
        let grid = new PF.Grid(dungeon.level)
        let finder = new PF.AStarFinder({
            allowDiagonal: true
        })
        let path = finder.findPath(e1.x, e1.y, e2.x, e2.y, grid)
        if (path.length >= 2) {
            return path.length
        } else {
            return false
        }
    },
    attackEntity: function(attacker, victim) {
        attacker.moving = true
        attacker.tweens = attacker.tweens || 0
        attacker.tweens += 1  

        this.scene.tweens.add({
            targets: attacker.sprite,
            onComplete: () => {
                attacker.sprite.x = this.map.tileToWorldX(attacker.x)
                attacker.sprite.y = this.map.tileToWorldX(attacker.y)
                attacker.moving = false
                attacker.tweens -= 1

                let damage = attacker.attack()
                victim.healthPoints -= damage

                console.log(`${attacker.name} does ${damage} damage to ${victim.name} which now has ${victim.healthPoints} life left`)
                
                if (victim.healthPoints <= 0) {
                    this.removeEntity(victim)
                }
            },
            x: this.map.tileToWorldX(victim.x),
            y: this.map.tileToWorldY(victim.y),
            ease: "Power2",
            hold: 20,
            duration: 80,
            delay: attacker.tweens * 200,
            yoyo: true
        })  
    }
}

export default dungeon