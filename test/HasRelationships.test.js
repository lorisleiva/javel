import test from 'ava'
import { stubs } from './helpers'
import { HasAttributes, HasRelationships } from '@'
const { Article, Comment, Tag, User } = stubs.withMixins(HasAttributes, HasRelationships)

test('Relationship attributes are wrapped into their relevant model', t => {
    const articleRelationships = new Article().relationships()
    t.is(articleRelationships.tags, Tag)
    t.is(articleRelationships.comments, Comment)
    t.is(articleRelationships.author, User)

    const article = new Article({
        id: 50,
        title: 'My blog post',
        tags: [
            { id: 1, name: 'Laravel' },
            { id: 2, name: 'Vue.js' },
        ],
        comments: [
            { id: 104, body: 'Super article, thanks!' },
            { id: 283, body: 'I\'ve got this error, please help me!' },
        ],
        author: { id: 42, name: 'Loris Leiva' }
    })

    article.tags.forEach(tag => t.true(tag instanceof Tag))
    article.comments.forEach(comment => t.true(comment instanceof Comment))
    t.true(article.author instanceof User)
})

test('Missing relationships are ignored', t => {
    const article = new Article()
    t.is(article.tags, undefined)
    t.is(article.comments, undefined)
    t.is(article.author, undefined)
})

test('The parent relationship can be remembered on the children models', t => {
    let parents = []
    let relationships = []

    const { Article } = stubs.withMixins(HasAttributes, HasRelationships, {
        addParentRelationship (parent, relationship) {
            parents.push(parent)
            relationships.push(relationship)
        }
    })
    
    const article = new Article({
        tags: [ {}, {} ], // 2 tags
        comments: [ {}, {} ], // 2 comments
        author: {} // 1 author
    })
    
    parents.forEach(parent => t.is(parent, article))
    relationships = relationships.reduce((acc, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }), {})
    t.is(relationships.tags, 2)
    t.is(relationships.comments, 2)
    t.is(relationships.author, 1)
})