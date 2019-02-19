import test from 'ava'
import {host, stubs} from './helpers'
import { HasAttributes, MakesRequests } from '@'
import IntegratesQueryBuilder from '@/IntegratesQueryBuilder'
const { Article } = stubs.withMixins(HasAttributes, MakesRequests, IntegratesQueryBuilder)
import mock from 'mock-require'
import nock from 'nock'
import { QueryBuilder } from './helpers/mock-js-query-builder'

const MOCK_JS_QUERY_BUILDER_PATH = './helpers/mock-js-query-builder.js'

test('It throws an error if "js-query-builder" is not installed', t => {
    t.throws(Article.query, Error)
})

test('It returns QueryBuilder instance on *query()* method call', t => {
    mock('js-query-builder', MOCK_JS_QUERY_BUILDER_PATH)

    t.true(Article.query() instanceof QueryBuilder)

    mock.stop('js-query-builder')
})

test('It returns proper results on *get()* method call', async t => {
    mock('js-query-builder', MOCK_JS_QUERY_BUILDER_PATH)

    nock(host)
        .get('/api/article?sort=-id')
        .reply(200, [
            { id: 3, name: 'My blog post part 3' },
            { id: 2, name: 'My blog post part 2' },
            { id: 1, name: 'My blog post part 1' },
        ])

    const articles = await Article.query().foo().bar().built('?sort=-id').get()

    t.is(articles.length, 3)
    t.is(articles[0].name, 'My blog post part 3')
    t.is(articles[1].name, 'My blog post part 2')
    t.is(articles[2].name, 'My blog post part 1')
    articles.forEach(article => t.true(article instanceof Article))
    t.true(nock.isDone())

    mock.stop('js-query-builder')
})
