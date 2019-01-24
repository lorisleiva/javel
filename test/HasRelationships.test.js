import test from 'ava'
import { stubs } from './helpers'
import { HasAttributes, HasRelationships } from '@'
const { Article, Comment, Tag, User } = stubs.withMixins(HasAttributes, HasRelationships)

test('dummy', t => {
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

    t.is(article.author.constructor, User)
})

