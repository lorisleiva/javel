# MakesRequests

**Requires:** `HasAttributes`.

| method | type | description |
| - | - | - |
| `baseUrl` | option | Defines an URL prefix used for every requests to the server. |
| `buildUrl` | option | Constructs an URL based on the request. |
| `beforeRequest` | option | **Hook** that pre-processes the request before sending it if needed. |
| `makeRequest` | option | Configures your HTTP service. (Defaults to axios is available on the `window`). |
| `afterRequest` | option | **Hook** that handles the response of every request. |
| `failedRequest` | option | **Hook** that handles failed requests. |
| `request` | new | Makes a custom request. |
| `all` | new | *(static)* Retrieves all models from the server as an array. |
| `paginate` | new | *(static)* Retrieves paginates models from the server. The array of models is nested in a `data` property. |
| `find` | new | *(static)* Retrieves a specific model with the given primary key. |
| `create` | new | *(static)* Creates a new model with the given attributes. |
| `persist` | new | Persists a model that does not yet exists on the server. |
| `update` | new | Updates a model with the given attributes. |
| `delete` | new | Removes a model from the server. |
| `save` | new | Persists or updates a model depending on its existance on the server. |

## Configure your HTTP service

Before being able to make requests using this mixin, you need to define which HTTP service you'd like Javel to use.

```js
import { Model as BaseModel } from 'javel'

class Model extends BaseModel {
    makeRequest (request) {
        return // Return a promise from your HTTP service.
    }
}
```

Here are a few examples.

### Axios

```js
import axios from 'axios'

makeRequest ({ method, url, data, query }) {
    return axios({ method, url, data, params: query })
}
```

Note that this the default behavior if `axios` is present in the `window` variable.

### Fetch

```js
makeRequest ({ method, url, data }) {
    return fetch(url, { method, body: data })
}
```

### jQuery

```js
makeRequest ({ method, url, data, query }) {
    return $.ajax({ url, type: method, data: method === 'GET' ? query : data })
}
```

## The request object

```js
const {
    method,     // => (String) GET (default), POST, PATCH, DELETE, etc...
    data        // => (Object) The body of the request.
    query,      // => (Object) Data to attach as a query string, e.g. `?foo=bar`.
    params,     // => (Array) The parameters to use to build the URL, e.g. [model.id]`
    url,        // => (String) The built URL
    action,     // => (String) Which method triggered this request, e.g. 'find', 'create', 'update', etc. Defaults to 'custom'
    isStatic,   // => (Boolean) Whether the request was triggered by a static call, e.g. Article.create(). Defaults to false.
    ...rest     // => Anything else you want to attach to the request.
} = request
```

Note that if you send a request without explicitly providing an `url`, the url will be generated using the `buildUrl` method.

## Configure URLs (routing)

### `baseUrl`
The `baseUrl` method allows you to prefix any URL before making a request and defaults to `api`.

```js
baseUrl () {
    return 'api'
}
```

### `buildUrl`
The `buildUrl` method allows you to configure how URLs are generated for a model. It provides the request as an argument and should return either a String or an Array of URL segments that will be properly joined. Consider the following example.

```js
buildUrl ({ action, params }) {
    if ([ 'find', 'update', 'delete' ].includes(action)) {
        const id = params[0]
        return ['article', id]
    }

    return 'article'
}
```

This would build the following URL for the following actions:

```
all         => '/api/article' (GET)
paginate    => '/api/article' (GET)
find        => '/api/article/:id' (GET)
create      => '/api/article' (POST)
persist     => '/api/article' (POST)
update      => '/api/article/:id' (PATCH)
delete      => '/api/article/:id' (DELETE)
```

However, by default, the `params` array equals to `[ model.primaryKey() ]` for the `find`, `update` and `delete` actions and is empty for all other actions. This means we can shorten the previous example whilst achieving the same result.

```js
buildUrl ({ params }) {
    return ['article', ...params]
    // When params is []    => '/api/article'
    // When params is [id]  => '/api/article/:id'
}
```

### Default `buildUrl` and minification issue
It is worth noting that by default, the `buildUrl` uses the name of the class and convert it to snake case to define the URL.

```js
buildUrl ({ params }) {
    return [snakeCase(this.constructor.name), ...params]
}

// class User => '/api/user'
// class Article => '/api/article'
// class CommentAttachment => '/api/comment_attachment'
```

Whilst this will work on development mode, when you'll compile your JavaScript for production, it will very likely be minified and therefore, `this.constructor.name` will not match the name of your class anymore. You'll end up with failed API calls like `/api/t` instead of `/api/article`.

To work around this issue, you'll either need to configure your minifier to keep class names intact or you'll have to explicitely define the `buildUrl` method for each model. The second approach has the advantage of being more explicit and you'll very likely need to tweek the `buildUrl` method for each model anyway.

```js
buildUrl ({ params }) {
    return ['article', ...params]
}
```

## Handle the response

TODO: afterRequest

## Other request hooks

TODO: before/failed

## Add extra request data to actions

TODO

## Create your own actions

TODO

## Override existing actions

TODO