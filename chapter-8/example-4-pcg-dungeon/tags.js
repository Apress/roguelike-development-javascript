import aggro from "./tags/aggro.js"
import fast from "./tags/fast.js"
import goingSomewhere from "./tags/goingsomewhere.js"
import patrolling from "./tags/patrolling.js"
import golden from "./tags/golden.js"
import iron from "./tags/iron.js"
import silver from "./tags/silver.js"
import hunter from "./tags/hunter.js"
import poison from "./tags/poison.js"
import burning from "./tags/burning.js"
import royal from "./tags/royal.js"
import cursed from "./tags/cursed.js"

const tags = {
    aggro,
    fast,
    goingSomewhere,
    golden,
    silver,
    iron,
    hunter,
    poison,
    burning,
    royal,
    patrolling,
    cursed
}

export const materials = [
    "golden",
    "silver",
    "iron"
]

export const enemyModifiers = [
    "aggro",
    "fast",
    "royal"
]

export const behaviors = [
    "goingSomewhere",
    "hunter",
    "patrolling"
]

export const effects = [
    "poison",
    "burning",
    "cursed"
]

export function getRandomTagsForItem(modifierCount = 1, effectCount = 0) {
    let res = new Set()

    while (modifierCount > 0) {
        res.add(Phaser.Utils.Array.GetRandom(materials))
        modifierCount--
    }

    while (effectCount > 0) {
        res.add(Phaser.Utils.Array.GetRandom(effects))
        effectCount--
    }

    return [...res]
}


export function getRandomTagsForEnemy(modifierCount = 1) {
    let res = new Set()

    while (modifierCount > 0) {
        res.add(Phaser.Utils.Array.GetRandom(enemyModifiers))
        modifierCount--
    }

    res.add(Phaser.Utils.Array.GetRandom(behaviors))

    return [...res]
}


export default tags