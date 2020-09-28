class DNode {
    constructor(area) {
        this.left = false
        this.right = false
        this.area = area
    }

    forEachArea(f) {
        f(this.area)

        if (this.left) {
            this.left.forEachArea(f)
        }

        if (this.right) {
            this.right.forEachArea(f)
        }
    }
}

class DArea {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}



function splitArea(area) {
    let x1, y1, w1, h1 = 0
    let x2, y2, w2, h2 = 0
    if (Phaser.Math.Between(0, 1) == 0) {
        // vertical
        let divider = Phaser.Math.Between(1, area.w)

        x1 = area.x
        y1 = area.y
        w1 = divider
        h1 = area.h

        x2 = area.x + w1
        y2 = area.y
        w2 = area.w - w1
        h2 = area.h

        if (w1 / h1 < 0.45 || w2 / h2 < 0.45) {
            return splitArea(area)
        }

    } else {
        // horizontal
        let divider = Phaser.Math.Between(1, area.h)

        x1 = area.x
        y1 = area.y
        w1 = area.w
        h1 = divider

        x2 = area.x
        y2 = area.y + h1
        w2 = area.w
        h2 = area.h - h1

        if (h1 / w1 < 0.45 || h2 / w2 < 0.45) {
            return splitArea(area)
        }
    }

    let a1 = new DArea(x1, y1, w1, h1)
    let a2 = new DArea(x2, y2, w2, h2)

    return [a1, a2]
}


function makeTree(area, iterations) {
    let root = new DNode(area)

    if (iterations != 0) {
        let [a1, a2] = splitArea(root.area)
        root.left = makeTree(a1, iterations - 1)
        root.right = makeTree(a2, iterations - 1)
    }

    return root
}

export default class BSPDungeon {
    constructor(width, height, iterations) {
        this.rootArea = new DArea(0, 0, width , height )


        this.tree = makeTree(this.rootArea, iterations)

        this.initializeLevelData()

    }

    initializeLevelData() {
        let lvl = []

        for (let y = 0; y <= this.rootArea.h; y++) {
            lvl[y] = lvl[y] || []
            for (let x = 0; x <= this.rootArea.w; x++) {
                lvl[y][x] = 0 // empty
            }
        }

        this.levelData = lvl
    }

    toLevelData() {
        return this.levelData
    }
}

