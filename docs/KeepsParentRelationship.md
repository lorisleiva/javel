# KeepsParentRelationship

**Requires:** `HasAttributes`, `HasRelationships`.

| method | type | description |
| - | - | - |
| `removeFromParent` | new | Removes itself from its parent. If the parent relationship is an array, the child will be removed of the array, otherwise the relationship will be set to `null`. |
| `addParentRelationship` | extends | Keeps track of the parent relationship through the `_parent` property. |
| `getAttributes` | extends | Ensures the `_parent` property is not included in the attributes. |
| `clone` | extends | Ensures the `_parent` property is kept when cloning a model. |

For the next examples, consider the following relationships on the `Article` model.

```js
import { Model, Tag, User } from '@/models'

class Article extends Model {
    relationships () {
        return {
            tags: Tag,
            author: User,
        }
    }
}
```

## The `_parent` property

The `_parent` property is an array of two items. The first item is a reference to the parent itself and the second item is the attribute from which we can reach the child from the parent.

```js
let article = new Article({ 
    author: { id: 1, name: 'Loris Leiva' }
})

let [parent, relationship] = article.author._parent
// => parent === article
// => relationship === 'author'
// => parent[relationship] === article.author
```

## The `RemoveFromParent` method

```js
let article = new Article({ 
    tags: [ { id: 1, name: 'Laravel' }, { id: 2, name: 'Vue.js' } ],
    author: { id: 1, name: 'Loris Leiva' },
})

article.author.removeFromParent()
// => article.author === null

article.tags[0].removeFromParent()
// => article.tags.length === 1
// => article.tags === [ Tag { id: 2, name: 'Vue.js' } ]
```