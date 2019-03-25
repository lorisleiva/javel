# IntegratesQueryBuilder

**Requires:** `MakesRequests`.

| method | type | description |
| - | - | - |
| `query` | new | TODO. |

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

## Documentation in progress...

TODO: Document features of `js-query-builder`.