import test from 'ava'
import { BaseModel, HasAttributes, mix } from '@'
const Model = class extends mix(BaseModel).with(HasAttributes) {}

test('Attributes get be assigned and retrieved without being altered', t => {
    const article = new Model
    const attributes = {
        name: 'My blog post',
        published_at: new Date(),
        views: 245,
    }

    t.deepEqual(article.getAttributes(article.setAttributes(attributes)), attributes)
})

test('Attributes are assigned directly to the object upon creation', t => {
    const attributes = {
        name: 'My blog post',
        published_at: new Date(),
        views: 245,
    }
    const article = new Model(attributes)

    t.is(article.name, attributes.name)
    t.is(article.published_at, attributes.published_at)
    t.is(article.views, attributes.views)
})

test('Attributes can be changed directly on the model', t => {
    const article = new Model({ name: 'My blog post' })
    article.name = 'My UPDATED blog post'
    t.is(article.getAttributes().name, 'My UPDATED blog post')
})

test('A model can be filled with updated attributes', t => {
    const article = new Model({ name: 'My blog post' })
    const result = article.fill({ name: 'My UPDATED blog post' })

    t.is(result, article)
    t.is(article.name, 'My UPDATED blog post')
    t.is(article.getAttributes().name, 'My UPDATED blog post')
})

test('A model can generate a new model with given attributes', t => {
    const articleA = new Model({ name: 'My blog post part 1' })
    const articleB = articleA.make({ name: 'My blog post part 2' })

    t.not(articleA, articleB)
    t.is(articleA.name, 'My blog post part 1')
    t.is(articleB.name, 'My blog post part 2')
})

test('A model can generate multiple new models', t => {
    const article = new Model({ name: 'My original blog post' })
    const [articleA, articleB, articleC] = article.make([
        { name: 'My blog post COPY A' },
        { name: 'My blog post COPY B' },
        { name: 'My blog post COPY C' },
    ])

    t.is(article.name, 'My original blog post')
    t.is(articleA.name, 'My blog post COPY A')
    t.is(articleB.name, 'My blog post COPY B')
    t.is(articleC.name, 'My blog post COPY C')
})

test('The default primary key for a model is its "id" attribute', t => {
    const article = new Model({ id: 42 })
    t.is(article.primaryKey(), 42)
})

test('A model is assumed to exist (in the database) if it has a primary key', t => {
    t.true(new Model({ id: 42 }).exists())
    t.false(new Model().exists())
})

test('Two models are considered equals if they have the same primary key', t => {
    t.true(new Model({ id: 42 }).is(new Model({ id: 42 })))
    t.false(new Model({ id: 5 }).is(new Model({ id: 42 })))
})

test('A model can be cloned without deep copy', t => {
    const article = new Model({ id: 42, name: 'My blog post', published_at: new Date() })
    const articleClone = article.clone()

    t.not(article, articleClone)
    t.is(article.id, articleClone.id)
    t.is(article.name, articleClone.name)
    t.is(article.published_at, articleClone.published_at) // No deep copy.
})