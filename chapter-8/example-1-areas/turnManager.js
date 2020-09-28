const tm = {
    entities: new Set(),
    addEntity: (entity) => tm.entities.add(entity),
    removeEntity: (entity) => tm.entities.remove(entity),
    refresh: () => {
        tm.entities.forEach(e => e.refresh())
        tm.currentIndex = 0
    },
    currentIndex: 0,
    turn: () => {
        if (tm.entities.size > 0) {
            let entities = [...tm.entities]
            let e = entities[tm.currentIndex]

            if (!e.over()) {
                e.turn()
            } else {
                tm.currentIndex++
            }
        }
    },
    over: () => [...tm.entities].every(e => e.over()),
}

export default tm