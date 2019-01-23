import { omit } from './utils'
import { Mixin } from 'mixwith'

/**
 * @needs HasAttributes
 * @needs HasRelationships
 */
export default Mixin((superclass) => class extends superclass
{
    getAttributes () {
        return omit(super.getAttributes(), '_parent')
    }

    clone () {
        let that = super.clone()
        this._parent && that.addParentRelationship(...this._parent)
        return that
    }

    addParentRelationship (parent, relationship) {
        this._parent = [parent, relationship]
        return this
    }

    removeFromParent () {
        const [parent, relationship] = this._parent

        if (Array.isArray(parent[relationship])) {
            const index = parent[relationship].indexOf(this)
            parent[relationship].splice(index, 1)
        } else {
            parent[relationship] = null
        }
    }
})