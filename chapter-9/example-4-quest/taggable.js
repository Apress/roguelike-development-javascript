import tags from "./tags.js"

export default class Taggable {
    addTagHandler(handlerName, handler) {
        if (!this._tagHandlers) {
            this._tagHandlers = {}
        }

        if (!this._tagHandlers[handlerName]) {
            this._tagHandlers[handlerName] = []
        }

        this._tagHandlers[handlerName].push(handler)
    }

    executeTag(handlerName, ret, ...args) {
        if (this._tagHandlers && this._tagHandlers[handlerName]) {
            this._tagHandlers[handlerName].forEach(handler => {
                args = [ret, ...args]
                ret = handler.apply(this, args)
            })
        }
        return ret
    }

    wrapFunction(handlerName) {
        if (!this._tagHandlers || !this._tagHandlers[handlerName]) {
            let originalFunction = this[handlerName]
            this[handlerName] = (...args) => {
                let ret = originalFunction.apply(this, args)
                return this.executeTag(handlerName, ret, ...args)
            }
        }
    }

    addTag(template) {
        let tag = {}
        Object.assign(tag, template)

        let name = tag.name
        delete tag.name

        tag.initialize.apply(this)
        delete tag.initialize

        let keys = Object.keys(tag)
        keys.forEach(handlerName => {
            this.wrapFunction(handlerName)
            this.addTagHandler(handlerName, tag[handlerName])
        })

        if (!this._tags) {
            this._tags = [name]
        } else {
            this._tags.push(name)
        }

        return this
    }

    removeTag(template) {
        let tag = {}
        Object.assign(tag, template)

        let name = tag.name
        delete tag.name
        delete tag.initialize

        let keys = Object.keys(tag)
        keys.forEach(handlerName => {
            let functionAsString = tag[handlerName].toString()
            let handlersAsString = this._tagHandlers[handlerName].map(handler => handler.toString())
            let index = handlersAsString.findIndex(handlerAsString => handlerAsString == functionAsString)
            this._tagHandlers[handlerName].splice(index, 1)
        })

        let tagPosition = this._tags.findIndex(tag => tag == name)
        this._tags.splice(tagPosition, 1)
    }

    addTags(templateNames) {

        templateNames.forEach(t => {
            if (tags[t]) {
                this.addTag(tags[t])
            }
        })
        return this
    }
}