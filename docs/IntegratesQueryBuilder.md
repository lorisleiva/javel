# IntegratesQueryBuilder

**Requires:** `MakesRequests`.

| method | type | description |
| - | - | - |
| `query` | new | returns QueryBuilder instance which allows you to filter, sort and include Eloquent relations |

## This mixin is not included by default and has external dependencies

You can add it to your models like this.

```js
import QueryBuilder from 'js-query-builder'
import { Model as BaseModel, mix, IntegratesQueryBuilder, registerModule } from 'javel'

registerModule('js-query-builder', QueryBuilder)

export default class Model extends mix(BaseModel).with(IntegratesQueryBuilder) {
    ///
}
```

## Integrates QueryBuilder

This mixin provides an easy way to filter, sort and include Eloquent relations by integrating [js-query-builder](https://github.com/coderello/js-query-builder) which is compatible with [laravel-query-builder](https://github.com/spatie/laravel-query-builder)

Let's imagine you have the `Article` model.

```js
import Model from './Model.js'

export default class Article extends Model {
    // Your logic here...
}
```

And you want to use some sorting and filters when getting articles. Here you are!

```js
const articles = await Article.query().filter('name', 'laravel').sort('updated_at').get()
```

Under the hood articles will be requested from the `/api/articles?filter[name]=laravel&sort=updated_at` which is the query string generated by the chain of method calls from the example above.

Full methods list of the `QueryBuilder` instance can be found in the [official documentation of `js-query-builder`](https://github.com/coderello/js-query-builder).