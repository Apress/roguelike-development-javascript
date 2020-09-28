import tm from "./turnManager.js"
import BSPDungeon from "./bspdungeon.js"


let dungeon = {
    msgs: [],
    sprites: {
        floor: 0,
        wall: 554,
    },
    tileSize: 16,
    initialized: false,
    initialize: function (scene) {
        // create the dungeon only once.
        if (!this.initialized) {
            console.log("dungeon not initialized")
            let dungeonConfig = {
                width: 80,
                height: 50,
                iterations: 4,
                levels: 5
            }
            this.dungeon = new BSPDungeon(dungeonConfig)
            this.initialized = true
        }

        console.log(`dungeon module: current dungeon level`, this.dungeon.currentLevel)
        this.level = this.dungeon.getCurrentLevel()
        this.rooms = this.dungeon.getRooms()
        this.tree = this.dungeon.getTree()
        this.stairs = this.dungeon.getStairs()
        this.scene = scene
        this.levelWithTiles = this.level.map(r => r.map(t => t == 1 ? this.sprites.wall : this.sprites.floor))

        const config = {
            data: this.levelWithTiles,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
        }

        const map = scene.make.tilemap(config)
        const tileset = map.addTilesetImage('tiles', 'tiles', this.tileSize, this.tileSize, 0, 1) // key: texture key
        this.map = map.createDynamicLayer(0, tileset, 0, 0)
    },
    cleanup: function () {
        this.msgs = []
        dungeon.player.cleanup()
        tm.cleanup()
    },
    goDown: function () {
        this.scene.cameras.main.once('camerafadeoutcomplete', () => {
            this.cleanup()
            this.dungeon.goDown()

            this.scene.events.emit('dungeon-changed')

        }, this);
        this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
    },
    goUp: function () {
        this.scene.cameras.main.once('camerafadeoutcomplete', () => {
            this.cleanup()
            this.dungeon.goUp()

            this.scene.events.emit('dungeon-changed')

        }, this);
        this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
    },
    isWalkableTile: function (x, y) {
        // check all entities.
        let allEntities = [...tm.entities]
        for (let e = 0; e < allEntities.length; e++) {
            let entity = allEntities[e]
            if (entity.sprite && entity.x == x && entity.y == y) {
                return false
            }
        }
        // check level
        let tileAtDestination = dungeon.map.getTileAt(x, y)
        return tileAtDestination.index !== dungeon.sprites.wall
    },
    randomWalkableTile: function () {
        let x = Phaser.Math.Between(0, dungeon.level[0].length - 1)
        let y = Phaser.Math.Between(0, dungeon.level.length - 1)
        let tileAtDestination = dungeon.map.getTileAt(x, y)
        while (typeof tileAtDestination == "undefined" || tileAtDestination.index == dungeon.sprites.wall) {
            x = Phaser.Math.Between(0, dungeon.level[0].length - 1)
            y = Phaser.Math.Between(0, dungeon.level.length - 1)
            tileAtDestination = dungeon.map.getTileAt(x, y)
        }
        return { x, y }
    },
    randomWalkableTileInRoom: function (x, y, w, h) {
        let rx = Phaser.Math.Between(x, (x + w) - 1)
        let ry = Phaser.Math.Between(y, (y + h) - 1)
        let tileAtDestination = dungeon.map.getTileAt(rx, ry)
        while (typeof tileAtDestination == "undefined" || tileAtDestination.index == dungeon.sprites.wall) {
            rx = Phaser.Math.Between(x, (x + w) - 1)
            ry = Phaser.Math.Between(y, (y + h) - 1)
            tileAtDestination = dungeon.map.getTileAt(rx, ry)
        }
        return { x: rx, y: ry }
    },
    entityAtTile: function (x, y) {
        let allEntities = [...tm.entities]
        for (let e = 0; e < allEntities.length; e++) {
            let entity = allEntities[e]
            if (entity.sprite && entity.x == x && entity.y == y) {
                return entity
            }
        }
        return false
    },
    removeEntity: function (entity) {
        if (entity.sprite) {
            entity.sprite.destroy()
            delete entity.sprite
            entity.onDestroy()
            tm.entities.delete(entity)
        }
    },
    itemPicked: function (entity) {
        entity.sprite.destroy()
        delete entity.sprite
    },
    initializeEntity: function (entity) {
        if (entity.x && entity.y) {
            let x = this.map.tileToWorldX(entity.x)
            let y = this.map.tileToWorldY(entity.y)
            entity.sprite = this.scene.add.sprite(x, y, "tiles", entity.tile)
            entity.sprite.setOrigin(0)
            if (entity.tint) {
                entity.sprite.tint = entity.tint
                entity.sprite.tintFill = true
            }
            entity.setEvents()
        }
    },
    describeEntity: function (entity) {
        if (entity) {
            let name = entity.name
            let description = entity.description || ""
            let tags = entity._tags ? entity._tags.map(t => `#${t}`).join(", ") : ""

            dungeon.log(`${name}\n${tags}\n${description}`)
        }
    },
    moveEntityTo: function (entity, x, y) {
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
    distanceBetweenEntities: function (e1, e2) {
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
    attackEntity: function (attacker, victim, weapon) {
        attacker.moving = true
        attacker.tweens = attacker.tweens || 0
        attacker.tweens += 1

        let rangedAttack = weapon.range() ? weapon.attackTile : false
        let tint = weapon.range() && weapon.tint ? weapon.tint : false

        if (!rangedAttack) {
            this.scene.tweens.add({
                targets: attacker.sprite,
                onComplete: () => {
                    attacker.sprite.x = this.map.tileToWorldX(attacker.x)
                    attacker.sprite.y = this.map.tileToWorldX(attacker.y)
                    attacker.moving = false
                    attacker.tweens -= 1

                    let attack = attacker.attack()
                    let protection = victim.protection()
                    let damage = attack - protection
                    this.log(`${victim.name} defends with ${protection}.`)
                    if (damage > 0) {
                        victim.healthPoints -= damage

                        this.log(`${attacker.name} does ${damage} damage to ${victim.name} with ${weapon.name}.`)
                        weapon.executeTag("damagedEntity", victim)

                        if (victim.healthPoints <= 0) {
                            this.removeEntity(victim)
                        }
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
        } else {
            const x = this.map.tileToWorldX(attacker.x)
            const y = this.map.tileToWorldX(attacker.y)
            const sprite = dungeon.scene.add.sprite(x, y, "tiles", rangedAttack).setOrigin(0)

            if (tint) {
                sprite.tint = tint
                sprite.tintFill = true
            }

            this.scene.tweens.add({
                targets: sprite,
                onComplete: () => {
                    attacker.moving = false
                    attacker.tweens -= 1

                    let attack = attacker.attack()
                    let protection = victim.protection()
                    let damage = attack - protection
                    this.log(`${victim.name} defends with ${protection}.`)
                    if (damage > 0) {
                        victim.healthPoints -= damage

                        this.log(`${attacker.name} does ${damage} damage to ${victim.name} with ${weapon.name}..`)
                        weapon.executeTag("damagedEntity", victim)

                        if (victim.healthPoints <= 0) {
                            this.removeEntity(victim)
                        }
                    }
                    sprite.destroy()
                },
                x: this.map.tileToWorldX(victim.x),
                y: this.map.tileToWorldY(victim.y),
                ease: "Power2",
                hold: 20,
                duration: 180,
                delay: attacker.tweens * 200
            })
        }


    },
    log: function (text) {
        this.msgs.unshift(text)
        this.msgs = this.msgs.slice(0, 8)
    }
}

export default dungeon