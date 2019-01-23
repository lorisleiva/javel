import { forOwn } from '@utils'
import { Mixin } from 'mixwith'

/**
 * @needs HasAttributes
 */
export default Mixin((superclass) => class extends superclass
{
    fill (...args) {
        super.fill(...args)
        this.wrapRelationships()
        return this
    }

    relationships () {
        return {}
    }

    addParentRelationship () {
        //
    }

    wrapRelationship (attributes, model, parent, relationship) {
        let result = new model(attributes)
        result.addParentRelationship(parent, relationship)
        return result
    }

    wrapRelationships () {
        let attributes = this.getAttributes() || {}
        forOwn(this.relationships(), (model, key) => {
            if (! attributes.hasOwnProperty(key) || ! attributes[key]) {
                return
            }
            attributes[key] = Array.isArray(attributes[key])
                ? attributes[key].map(nested => this.wrapRelationship(nested, model, this, key))
                : this.wrapRelationship(attributes[key], model, this, key)
        })
        this.setAttributes(attributes)
    }
})