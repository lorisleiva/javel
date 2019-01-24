import test from 'ava'
import { stubs } from './helpers'
import { HasAttributes, GeneratesUniqueKey } from '@'
const { Article } = stubs.withMixins(HasAttributes, GeneratesUniqueKey)

test('It generates a new unique key on a model', t => {
    const articleA = new Article()
    const articleB = new Article()
    t.true(typeof articleA._key === 'string')
    t.true(typeof articleB._key === 'string')
    t.not(articleA._key, articleB._key)
})

test('It uses the primary key of the model as a unique key if it exists',  t => {
    const article = new Article({ id: 1 })
    t.is(article._key, 1)
    t.is(article.primaryKey(), 1)
})

test('It does not include the key on the attributes', t => {
    const article = new Article()
    t.not(article._key, undefined)
    t.is(article.getAttributes()._key, undefined)
})

test('Once the key is set it is not set again, even if a primary key is now available', t => {
    const article = new Article()
    const originalKey = article._key
    t.true(typeof originalKey === 'string')
    t.is(article.primaryKey(), undefined)
    
    article.fill({ id: 1 })
    t.is(article.primaryKey(), 1)
    t.is(article._key, originalKey)
    t.not(article._key, 1)
})