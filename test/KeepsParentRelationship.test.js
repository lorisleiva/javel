import test from 'ava'
import { stubs } from './helpers'
import { HasAttributes, HasRelationships, KeepsParentRelationship } from '@'
const { Article, Comment, Tag, User } = stubs.withMixins(HasAttributes, HasRelationships, KeepsParentRelationship)

test('Assert article relationships', t => {
    t.deepEqual(new Article().relationships(), {
        tags: Tag,
        comments: Comment,
        author: User,
    })
})

test('Each relationship keeps track of its parent and how to access itself from it', t => {
    const article = new Article({
        tags: [{ id: 1, name: 'Laravel' }],
        comments: [{ id: 104, body: 'Super article, thanks!' }],
        author: { id: 42, name: 'Loris Leiva' },
    })

    t.deepEqual(article.tags[0]._parent, [article, 'tags'])
    t.deepEqual(article.comments[0]._parent, [article, 'comments'])
    t.deepEqual(article.author._parent, [article, 'author'])
})

test('The parent variable is not included in the attributes', t => {
    const article = new Article({
        author: { id: 42, name: 'Loris Leiva' },
    })

    t.false(article.author.getAttributes().hasOwnProperty('_parent'))
})

test('Parent relationship is kept when cloning', t => {
    const article = new Article({
        author: { id: 42, name: 'Loris Leiva' },
    })

    const originalAuthor = article.author
    const clonedAuthor = originalAuthor.clone()

    t.not(originalAuthor, clonedAuthor)
    t.deepEqual(originalAuthor._parent, [article, 'author'])
    t.deepEqual(clonedAuthor._parent, [article, 'author'])
})

test('Keeping parent relationships allows children to remove themselves from their parent', t => {
    const article = new Article({
        tags: [
            { id: 1, name: 'Laravel' },
            { id: 2, name: 'Vue.js' },
        ],
        author: { id: 42, name: 'Loris Leiva' },
    })

    article.author.removeFromParent()
    article.tags[0].removeFromParent()

    t.is(article.author, null)
    t.is(article.tags.length, 1)
    t.is(article.tags[0].name, 'Vue.js')
})