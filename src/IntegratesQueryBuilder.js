import { Mixin } from 'mixwith'

/**
 * @needs MakesRequests
 */
export default Mixin((superclass) => class extends superclass
{
    beforeRequest(request) {
        if (superclass.hasOwnProperty('beforeRequest')) {
            superclass.beforeRequest(request)
        }

        if (!request.builder) {
            return request
        }

        if (typeof request.builder !== 'function') {
            throw new Error('Builder property must be a function.')
        }

        let queryBuilderModule

        try {
            queryBuilderModule = require('js-query-builder')
        } catch (e) {
            throw new Error('IntegratesQueryBuilder mixin requires "js-query-builder" dependency to be installed.')
        }

        const builder = queryBuilderModule.query()

        request.builder(builder)

        request.query = builder
            .build()
            .split('?')[1]
            .split('&')
            .map(part => part.split('='))
            .reduce((query, [key, value]) => {
                const decodedKey = decodeURIComponent(key)

                if (!query.hasOwnProperty(decodedKey)) {
                    query[decodedKey] = decodeURIComponent(value)
                }

                return query
            }, typeof request.query === 'object' ? request.query : {})

        return request
    }
})
