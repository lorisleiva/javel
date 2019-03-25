import test from 'ava'
import nock from 'nock'
import { host, stubs, MocksServer } from './helpers'
import { HasAttributes, MakesRequests, IntegratesQueryBuilder, registerModule, forgetAllModules } from '@'
const { Article } = stubs.withMixins(HasAttributes, MakesRequests, IntegratesQueryBuilder, MocksServer)
import * as MockJsQueryBuilder from './helpers/mock-js-query-builder'

test('It throws an error if "js-query-builder" is not installed', t => {
    t.throws(Article.query, Error)
})

test('It returns QueryBuilder instance on *query()* method call', t => {
    registerModule('js-query-builder', MockJsQueryBuilder)

    t.true(Article.query() instanceof MockJsQueryBuilder.QueryBuilder)

    forgetAllModules()
})

test('It returns proper results on *get()* method call', async t => {
    registerModule('js-query-builder', MockJsQueryBuilder)

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

    forgetAllModules()
})
