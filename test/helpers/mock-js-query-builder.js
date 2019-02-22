const QueryBuilder = class {
    constructor(...args) {
        this._built = '?'
    }

    foo(...args) {
        return this
    }

    bar(...args) {
        return this
    }

    built(built) {
        this._built = built
        return this
    }

    build() {
        return this._built
    }
}

const query = (...args) => new QueryBuilder(...args)

export { QueryBuilder, query }
