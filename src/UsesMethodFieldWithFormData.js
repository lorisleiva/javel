import { Mixin } from '@'

/**
 * @needs HasAttributes
 * @needs MakesRequests
 */
export default Mixin((superclass) => class extends superclass
{
    update (attributes, configs = {}) {
        if (attributes instanceof FormData) {
            configs = { method: 'POST', ...configs }
            attributes.append('_method', 'PATCH')
        }
        return super.update(attributes, configs)
    }
})