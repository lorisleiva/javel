import test from 'ava'
import nock from 'nock'
import { stubs, host, MocksServer } from './helpers'
import { Mixin, HasAttributes, MakesRequests, UsesMethodFieldWithFormData } from '@'

// Make fake FormData globally available in tests.
global.FormData = class FormData {
    append(key, value) {
        this[key] = value
    }
}

// Make sure to convert fake FormData into a plain object before sending to axios.
const MocksFormData = Mixin(superclass => class extends superclass {
    makeRequest (request) {
        request.data = { ...request.data }
        return super.makeRequest(request)
    }
})

// Prepare our Article model.
const { Article } = stubs.withMixins(HasAttributes, MakesRequests, UsesMethodFieldWithFormData, MocksServer, MocksFormData)

test('It replaces updates using FormData with POST requests and _method=PATCH field', async t => {
    nock(host)
        .post('/api/article/1', { 
            image: '[multipart/form-data]',
            _method: 'PATCH'
        })
        .reply(200, {
            id: 1,
            name: 'My blog post',
            image: 'http://example.com/path/to/image.jpg'
        })

    const article = new Article({ id: 1, name: 'My blog post' })
    const data = new FormData()
    data.append('image', '[multipart/form-data]')

    await article.update(data)

    t.is(article.image, 'http://example.com/path/to/image.jpg')
    t.true(nock.isDone())
})