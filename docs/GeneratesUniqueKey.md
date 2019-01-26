# GeneratesUniqueKey

**Requires:** `HasAttributes`.

| method | type | description |
| - | - | - |
| `setKey` | new | Defines a unique `_key` property on the model. |
| `getAttributes` | extends | Ensures the `_key` property is not included in the attributes. |
| `fill(...args)` | [extends](lifecycle.md) | Calls the `setKey` method. |

## This mixin is not included by default

You can add it to your models like this.

```js
import { Model as BaseModel, mix, GeneratesUniqueKey } from 'javel'

export default class Model extends mix(BaseModel).with(GeneratesUniqueKey) {
    ///
}
```

## Generates unique keys

This mixin simply ensures there is always a unique `_key` property on your models. If a `primaryKey()` is available on the model, it will be used for the `_key`, otherwise a unique `_key` will be generated.

```js
let articleA = await Article.find(1)    // => articleA._key === 1
let articleB = new Article()            // => articleB._key === 'new_0'
```

Once assigned the unique key does not change, even if a primary key is now avaialble.

```js
let article = new Article()     // => article._key === 'new_0'
await article.persist()         // => article._key === 'new_0' && article.id === 1
```

This mixin is particularly useful when frameworks require you to provide a unique key on a model that hasn't been persisted yet. For example with Vue.js you could use `:key="article._key"`.