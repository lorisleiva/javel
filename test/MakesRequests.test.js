import test from 'ava'
import nock from 'nock'
import { stubs, host, MocksServer } from './helpers'
import { HasAttributes, MakesRequests } from '@'
const { Article } = stubs.withMixins(HasAttributes, MakesRequests, MocksServer)

test('It can fetch all resources of a model', async t => {
    nock(host)
        .get('/api/article')
        .reply(200, [
            { id: 1, name: 'My blog post part 1' },
            { id: 2, name: 'My blog post part 2' },
        ])

    const articles = await Article.all()
    t.is(articles.length, 2)
    t.is(articles[0].name, 'My blog post part 1')
    t.is(articles[1].name, 'My blog post part 2')
    articles.forEach(article => t.true(article instanceof Article))
    t.true(nock.isDone())
})

test('It can fetch multiple resources of a model using pagination', async t => {
    nock(host)
        .get('/api/article')
        .reply(200, {
            current_page: 1,
            last_page: 4,
            data: [
                { id: 1, name: 'My blog post part 1' },
                { id: 2, name: 'My blog post part 2' },
            ]
        })

    const response = await Article.paginate()
    t.is(response.current_page, 1)
    t.is(response.last_page, 4)
    response.data.forEach(article => t.true(article instanceof Article))
    t.true(nock.isDone())
})

test('It can fetch a resource by its primary key', async t => {
    nock(host)
        .get('/api/article/5')
        .reply(200, { id: 5, name: 'My blog post #5' })
    
    const article = await Article.find(5)
    t.true(article instanceof Article)
    t.is(article.id, 5)
    t.is(article.name, 'My blog post #5')
    t.true(nock.isDone())
})

test('It can create a new resource with some given attributes', async t => {
    nock(host)
        .post('/api/article', { name: 'My brand new blog post' })
        .reply(201, { id: 6, name: 'My brand new blog post' })
    
    const article = await Article.create({ name: 'My brand new blog post' })
    t.true(article instanceof Article)
    t.is(article.id, 6)
    t.is(article.name, 'My brand new blog post')
    t.true(nock.isDone())
})

test('It can persist a model that does not yet exists on the server', async t => {
    nock(host)
        .post('/api/article', { name: 'My draft post is ready to be published' })
        .reply(201, { id: 7, name: 'My draft post is ready to be published' })
    
    const article = new Article({ name: 'My draft post is ready to be published' })
    t.true(article instanceof Article)
    t.is(article.primaryKey(), undefined)
    t.is(article.name, 'My draft post is ready to be published')

    const articlePersisted = await article.persist()
    t.is(article, articlePersisted)
    t.is(article.primaryKey(), 7)
    t.true(nock.isDone())
})

test('It can update an existing model with some given attributes', async t => {
    nock(host)
        .patch('/api/article/1', { name: 'My updated blog post' })
        .reply(201, { id: 1, name: 'My updated blog post' })
    
    const article = new Article({ id: 1, name: 'My blog post' })
    const articleUpdated = await article.update({ name: 'My updated blog post' })
    t.is(article, articleUpdated)
    t.is(article.name, 'My updated blog post')
    t.true(nock.isDone())
})

test('It can save the changes that have been made on the model', async t => {
    nock(host)
        .patch('/api/article/1', { id: 1, name: 'My updated blog post', views: 245 })
        .reply(200, { id: 1, name: 'My updated blog post', views: 245 })

    const article = new Article({ id: 1, name: 'My blog post' })
    article.name = 'My updated blog post'
    article.views = 245
    await article.save()
    t.true(nock.isDone())
})

test('It can save non-persisted models by creating them first', async t => {
    nock(host)
        .post('/api/article', { name: 'My newest blog post' })
        .reply(200, { id: 8, name: 'My newest blog post' })

    const article = new Article()
    article.name = 'My newest blog post'
    await article.save()
    t.is(article.primaryKey(), 8)
    t.true(nock.isDone())
})