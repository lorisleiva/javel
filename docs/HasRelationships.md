# HasRelationships

**Requires:** `HasAttributes`.

| method | type | description |
| - | - | - |
| `relationships` | option | Configure which attributes should be wrapped with which model. |
| `addParentRelationship` | option | Empty hook called when a child relationship is created. |
| `wrapRelationships` | new | Iterates through the relationships and wraps each attribute that matches them.  |
| `wrapRelationship` | new | Helper method that wrap individual models. |
| `fill(...args)` | [extends](lifecycle.md) | Calls the `wrapRelationships` method. |

## Setting up relationships

It is common that model's attributes are instances of other models themselves. In this case, you can configure your model's relationships so that these attributes will be automatically wrapped in the right model. Consider the following example.

```js
import { Model, Tag, Comment, User } from '@/models'

class Article extends Model {
    relationships () {
        return {
            tags: Tag,
            comments: Comment,
            author: User,
        }
    }
}
```

Now that the relationships on the `Article` model have been defined, when we next create an article...

```js
let article = new Article({
    tags: [ { id: 1, name: 'Laravel' }, { id: 2, name: 'Vue.js' } ],
    comments: [ { id: 29, body: 'Great article, thanks!' } ],
    author: { id: 1, name: 'Loris Leiva' }
})
```

... all attributes that matches the relationships have been wrapped into the right model.

```js
article.tags        // => [ Tag* ]
article.comments    // => [ Comment* ]
article.author      // => User { id:1, name: 'Loris Leiva' }
```

As you can see, if the attribute that matches the relationship is an array, Javel will automatically wrap every item of this array.

## The parent relationship hook

Every time a parent's attribute is wrapped in an child model, the `addParentRelationship` method is called on the child. 

```js
/**
 * @param parent The parent model
 * @param relationship The attribute to call on the parent to reach this model.
 */
addParentRelationship (parent, relationship) {
    //
}
```

This method doesn't do anything but enables other mixins to attach some logic into this process. In particular, it enables the [native `KeepsParentRelationship` mixin](KeepsParentRelationship.md) to keep track of the parent in a `_parent` variable.