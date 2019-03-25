const QueryBuilder = class {
    constructor() {
        this._built = '?'
    }

    foo() {
        return this
    }

    bar() {
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
