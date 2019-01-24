import { Mixin } from 'mixwith'

export default Mixin((superclass) => class extends superclass
{
    fill (attributes = {}, ...args) {
        super.fill(attributes, ...args)
        this.setAttributes(attributes)
        return this
    }

    make (attributes = {}, ...args) {
        return Array.isArray(attributes)
            ? attributes.map(nested => new this.constructor(nested, ...args))
            : new this.constructor(attributes, ...args)
    }

    setAttributes (attributes) {
        Object.assign(this, attributes)
    }

    getAttributes () {
        return { ...this }
    }

    primaryKey () {
        return this.getAttributes().id
    }

    exists () {
        return !! this.primaryKey()
    }

    is (that) {
        return this.primaryKey() === that.primaryKey()
    }

    clone () {
        return this.make({ ...this.getAttributes() })
    }
})