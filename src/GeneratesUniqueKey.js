import { omit } from './utils'
import { Mixin } from 'mixwith'

/**
 * @needs HasAttributes
 */
export default Mixin((superclass) => class extends superclass
{
    fill (...args) {
        super.fill(...args)
        this.setKey()
        return this
    }

    setKey () {
        if (this._key) return
        this._key = this.exists() ? this.primaryKey() : generateKey()
    }

    getAttributes () {
        return omit(super.getAttributes(), '_key')
    }
})

let newKeyGenerator = 0;

function generateKey(prefix = 'new_') {
    return `${prefix}${newKeyGenerator++}`
}