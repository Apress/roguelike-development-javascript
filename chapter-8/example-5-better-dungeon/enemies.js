import Skeleton from "./enemies/skeleton.js"
import Orc from "./enemies/orc.js"
import Bat from "./enemies/bat.js"
import Troll from "./enemies/troll.js"
import { getRandomTagsForEnemy } from "./tags.js"

const enemies = {
    Skeleton,
    Orc,
    Bat,
    Troll
}

export default enemies


export function getRandomEnemy(x, y, modifierCount = 1, effectCount = 1) {
    let key = Phaser.Utils.Array.GetRandom(Object.keys(enemies))
    let tags = getRandomTagsForEnemy(modifierCount, effectCount)
    return new enemies[key](x, y).addTags(tags)
}