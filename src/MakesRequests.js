import { snakeCase, URLJoin, flatten } from './utils'
import { Mixin } from 'mixwith'

/**
 * @needs HasAttributes
 */
export default Mixin((superclass) => class extends superclass
{

    /**
     * URLS
     */

    baseUrl () {
        return '/api'
    }

    buildUrl ({ params }) {
        return [snakeCase(this.constructor.name), ...params]
    }

    /**
     * Request
     */

    async request (request) {
        request = Object.assign({}, DEFAULT_REQUEST, request)
        request.url = URLJoin(flatten([ this.baseUrl(), request.url || this.buildUrl(request) ]))
        request = this.beforeRequest(request)

        try {
            let response = await this.makeRequest(request)
            return this.afterRequest(response, request)
        } catch (error) {
            return this.failedRequest(error, request)
        }
    }
    
    makeRequest ({ method, url, data, query }) {
        if (axios) {
            return axios({ method, url, data, params: query })
        }

        throw new Error('Please override the `makeRequest` method and choose your http dependency.')
    }

    /**
     * Request Hooks
     */

    beforeRequest (request) {
        return request
    }

    afterRequest ({ data }, { action, isStatic }) {
        if (action === 'paginate') {
            data.data = this.make(data.data)
            return data
        }

        return isStatic ? this.make(data) : this.fill(data)
    }

    failedRequest (error) {
        throw error
    }

    /**
     * Request Shortcuts
     */

    static all (configs = {}) {
        return (new this).request({ method: 'GET', isStatic: true, action: 'all', ...configs })
    }

    static paginate (configs = {}) {
        return (new this).request({ method: 'GET', isStatic: true, action: 'paginate', ...configs })
    }

    static find (key, configs = {}) {
        return (new this).request({ method: 'GET', isStatic: true, action: 'find', params: [key], ...configs })
    }

    static create (attributes, configs = {}) {
        return (new this).request({ method: 'POST', isStatic: true, action: 'create', data: attributes, ...configs })
    }

    persist (attributes = null, configs = {}) {
        attributes = attributes || this.getAttributes()
        return this.request({ method: 'POST', action: 'persist', data: attributes, ...configs })
    }

    update (attributes, configs = {}) {
        return this.request({ method: 'PATCH', action: 'update', params: [this.primaryKey()], data: attributes, ...configs })
    }
    
    delete (configs = {}) {
        return this.request({ method: 'DELETE', action: 'delete', params: [this.primaryKey()], ...configs })
    }

    save (attributes = null, configs = {}) {
        attributes = attributes || this.getAttributes()
        return this.exists() 
            ? this.update(attributes, configs)
            : this.persist(attributes, configs)
    }
})

const DEFAULT_REQUEST = {
    action: 'custom',
    isStatic: false,
    method: 'GET',
    data: null,
    params: [],
}