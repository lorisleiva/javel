# UsesMethodFieldWithFormData

**Requires:** `HasAttributes`, `MakesRequests`.

| method | type | description |
| - | - | - |
| `update` | extends | Overrides the `method` of the `update` action when the given data is an instance of FormData.  |

## This mixin is not included by default

You can add it to your models like this.

```js
import { Model as BaseModel, mix, UsesMethodFieldWithFormData } from 'javel'

export default class Model extends mix(BaseModel).with(UsesMethodFieldWithFormData) {
    ///
}
```

## The FormData update issue with Laravel

This mixin provides a workaround a [known issue](https://github.com/laravel/framework/issues/13457) with Laravel.

When sending files to the server through an instance of `FormData` (i.e. multipart/form-data), the server will interpret the method as a `POST`. So if you're trying to send a `PATCH` request to, say, update a profile picture, it will reach you `POST` endpoint on the server.

This mixin solves this issue by overriding the `update` action and checking if the provided `attributes` argument is an instance of FormData. If this is the case, it changes the method to a `POST` and adds the field `_method=PATH` to tell Laravel that we want to reach the `PATCH` endpoint.