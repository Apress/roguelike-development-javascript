import Amulet from "./items/amulet.js"
import dungeon from "./dungeon.js"
import tm from "./turnManager.js"

function addAmulet() {
    if (dungeon.dungeon.currentLevel == dungeon.dungeon.levels.length - 1) {
        let room = Phaser.Math.RND.weightedPick(dungeon.rooms)
        let pos = dungeon.randomWalkableTileInRoom(room.x, room.y, room.w, room.h)
        tm.addEntity(new Amulet(pos.x, pos.y))
        console.log(`amulet added to`, pos)
    }
}

const quest = [
    addAmulet
]

export default quest