import { Mixin } from 'mixwith'
import Javel from '@/Javel'

/**
 * @needs MakesRequests
 */
export default Mixin((superclass) => class extends superclass
{
    static query() {
        let queryBuilderModule

        try {
            queryBuilderModule = Javel.resolveOptionalModule('js-query-builder')
        } catch (e) {
            throw new Error('IntegratesQueryBuilder mixin requires optional "js-query-builder" module to be registered.')
        }

        const builder = queryBuilderModule.query()

        builder.get = (configs = {}) => {
            const params = builder
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
                }, {})

            configs.query = Object.assign(params, configs.query)

            return this.all(configs)
        }

        return builder
    }
})
