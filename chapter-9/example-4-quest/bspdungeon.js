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

    forEachLeaf(f) {
        if (!this.left && !this.right) {
            f(this.area)
        }

        if (this.left) {
            this.left.forEachLeaf(f)
        }

        if (this.right) {
            this.right.forEachLeaf(f)
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

class DRoom {
    constructor(area) {
        this.x = Math.floor(area.x + (Phaser.Math.Between(1, area.w) / 3))
        this.y = Math.floor(area.y + (Phaser.Math.Between(1, area.h) / 3))
        this.w = area.w - (this.x - area.x)
        this.h = area.h - (this.y - area.y)
        this.w -= Math.floor(Phaser.Math.Between(1, this.w / 3))
        this.h -= Math.floor(Phaser.Math.Between(1, this.h / 3))
    }
}



function splitArea(area) {
    let x1, y1, w1, h1 = false
    let x2, y2, w2, h2 = false
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
    constructor(config) {
        let levels = []

        for (let c = 0; c < config.levels; c++) {
            levels.push(new BSPLevel(config.width, config.height, config.iterations))
        }

        this.levels = levels
        this.currentLevel = 0
    }

    goDown() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++
        } else {
            console.error("can't go down, already at the bottom of the dungeon.")
        }
    }

    goUp() {
        if (this.currentLevel > 0) {
            this.currentLevel--
        } else {
            console.error("can't go up, already at top of the dungeon.")
        }
    }

    getCurrentLevel() {
        return this.levels[this.currentLevel].toLevelData()
    }

    getRooms() {
        return this.levels[this.currentLevel].getRooms()
    }

    getTree() {
        return this.levels[this.currentLevel].tree
    }

    getStairs() {
        let stairs = {}

        if (this.currentLevel < this.levels.length - 1) {
            stairs.down = this.levels[this.currentLevel].down
        }

        if (this.currentLevel > 0) {
            stairs.up = this.levels[this.currentLevel].up
        }
        return stairs
    }
}

class BSPLevel {
    constructor(width, height, iterations) {
        this.rootArea = new DArea(0, 0, width, height)


        this.tree = makeTree(this.rootArea, iterations)

        this.initializeLevelData()

        this.makeRooms()
        this.makeCorridors()
        this.addStairs()

    }

    initializeLevelData() {
        let lvl = []

        for (let y = 0; y <= this.rootArea.h; y++) {
            lvl[y] = lvl[y] || []
            for (let x = 0; x <= this.rootArea.w; x++) {
                lvl[y][x] = 1
            }
        }

        this.levelData = lvl
    }

    fillRect(x, y, w, h, tile) {
        for (let y1 = y; y1 < y + h; y1++) {
            for (let x1 = x; x1 < x + w; x1++) {
                this.levelData[y1][x1] = tile
            }
        }
    }

    line(x1, y1, x2, y2, tile) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                this.levelData[y][x] = tile
            }
        }
    }

    makeRooms() {

        const makeRoom = (area) => {
            area.room = new DRoom(area)
            this.fillRect(area.room.x, area.room.y, area.room.w, area.room.h, 0)
        }
        this.tree.forEachLeaf(makeRoom)
    }

    makeCorridors() {
        const makePath = (node) => {
            if (node.left && node.right) {
                let x1 = Math.floor(node.left.area.x + (node.left.area.w / 2))
                let y1 = Math.floor(node.left.area.y + (node.left.area.h / 2))

                let x2 = Math.floor(node.right.area.x + (node.right.area.w / 2))
                let y2 = Math.floor(node.right.area.y + (node.right.area.h / 2))

                this.line(x1, y1, x2, y2, 0)

                makePath(node.left)
                makePath(node.right)
            }
        }
        makePath(this.tree)
    }

    toLevelData() {
        return this.levelData
    }

    getRooms() {
        let rooms = []
        this.tree.forEachLeaf(area => {
            rooms.push(area.room)
        })
        return rooms
    }

    addStairs() {
        // Place stairs down in the room at the 
        // right-most tree node. 
        let node = this.tree.right
        while (node.right !== false) {
            node = node.right
        }
        let r = node.area.room
        let dx = Phaser.Math.Between(r.x+1, r.x+r.w-1)
        let dy = Phaser.Math.Between(r.y+1, r.y+r.h-1)

        this.down = {
            x: dx,
            y: dy
        }

        // Place stairs up in the room at the 
        // left-most tree node. 
        node = this.tree.left
        while (node.left !== false) {
            node = node.left
        }
        r = node.area.room
        let ux = Phaser.Math.Between(r.x+1, r.x+r.w-1)
        let uy = Phaser.Math.Between(r.y+1, r.y+r.h-1)

        this.up = {
            x: ux,
            y: uy
        }
    }
}

