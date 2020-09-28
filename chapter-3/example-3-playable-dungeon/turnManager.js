const tm = {
    interval: 150,
    entities: new Set(),
    lastCall: Date.now(),
    addEntity: (entity) => tm.entities.add(entity),
    removeEntity: (entity) => tm.entities.remove(entity),
    refresh: () => tm.entities.forEach(e => e.refresh()),
    turn: () => {
        let now = Date.now()
        let limit = tm.lastCall + tm.interval
        if (now > limit) {
            for (let e of tm.entities) {
                if (!e.over()) {
                    e.turn()
                    break;
                }
            }
            tm.lastCall = Date.now()
        }
    },
    over: () => [...tm.entities].every(e => e.over()),
}

export default tm