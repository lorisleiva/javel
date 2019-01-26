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

This would build the following URLs for the following actions.

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

Whilst this will work on development mode, when you'll compile your JavaScript for production, it will very likely be minified and, therefore, `this.constructor.name` will not match the name of your class anymore. You'll end up with failed API calls like `/api/t` instead of `/api/article`.

To work around this issue, you'll either need to configure your minifier to keep class names intact or you'll have to explicitely define the `buildUrl` method for each model. The second approach has the advantage of being more explicit and you'll very likely need to tweak the `buildUrl` method for each model anyway.

```js
buildUrl ({ params }) {
    return ['article', ...params]
}
```

## Handle the response

You can configure how to handle the response of each actions via the `afterRequest` hook. Whatever you return here is what will be returned by the action. The `afterRequest` method provides the `response` from the server as the first argument and the `request` that was sent as the second argument.

```js
afterRequest (response, request) {
    //
}
```

### Default `afterRequest`
By default, the `afterRequest` method will `make` a new model (or list of models) if the action was made through a static call (e.g. `Article.create()`) and `fill` the current one otherwise. The only exception is for the `paginate` action which should return a list of models in a nested `data` attribute.

```js
afterRequest ({ data }, { action, isStatic }) {
    if (action === 'paginate') {
        data.data = this.make(data.data)
        return data
    }

    return isStatic ? this.make(data) : this.fill(data)
}
```

### Customize `afterRequest`
Consider the following example.

```js
afterRequest ({ data }) {
    return this.make(data)
}
```

This will retrieve a brand new instance of a model every time you make a call to the server. Thefore you'll need to update the reference of the object when you update it, e.g. `article = await article.update(...)`. This can be a good way to avoid the problem of attributes removed from the server ([See HasAttributes](HasAttributes.md#setting-attributes-directly-on-the-object)). Note that I removed the use case of the `paginate` action for simplicity.

Another example would be to change the behavior of a single action but keep the rest as-is.

```js
afterRequest (response, request) {
    if (request.action === 'delete') {
        this.removeFromParent()
        return this
    }

    return super.afterRequest(response, request)
}
```

This will make sure the model is deleted from its parent relationship (if any) upon deletion from the server. Note that the `removeFromParent` method comes from the [`KeepsParentRelationship` mixin](KeepsParentRelationship.md) (included in Javel's Model).

## Other request hooks

### `beforeRequest`
Called right before making the request (after the URL has been built). Defaults to:

```js
beforeRequest (request) {
    return request
}
```

### `failedRequest`
Called when the request to the server did not succeed. Default to:

```js
failedRequest (error, request) {
    throw error
}
```

## Add extra request details to your actions

The last argument of every action is a `configs` variable that will be merged to the request.

For example, if you wanted to pass some filters to your `Article.all()` action, you could do.

```js
const query = { search: 'Laravel', limit: 5 }
const articles = await Article.all({ query })
// => GET '/api/article?search=Laravel&limit=5'
```

You could also change the method of the `update` action.

```js
await article.update(
    { name: 'Updated blog post', _method: 'PATCH' }, // => attributes, shortcut used as data
    { method: 'POST' }                               // => configs, merged with the request
)
```

Another example could be to explicitly provide an URL that includes a parent's primary key.

```js
const article = await Article.find(1)
const comment = await Comment.create(
    { body: 'Super article, thanks!' },
    { url: `article/${article.primaryKey()}/comment` },
)
// => POST '/api/article/1/comment'
```

Note that you could also implement that last example by updating the `buildUrl` method.

## Override existing actions

It might sometimes make more sense to override the action altogether to make your calls a bit cleaner. For instance, this is how we would clean up the previous example.

```js
class Comment extends Model {
    static create (article, attributes, configs = {}) {
        return super.create(attributes, { url: `article/${article.primaryKey()}/comment`, ...configs })
    }
}
```

```js
const article = await Article.find(1)
const comment = await Comment.create(article, { body: 'Super article, thanks!' })
// => POST '/api/article/1/comment'
```

## Create your own actions

If you look at the actions implemented in the `MakesRequests` mixin, you can see that there isn't much to it. You simply need to call the `request` method to make a custom request and provide the default settings that define your action.

For example you could have a `publish` action that publishes the current article.

```js
publish (configs = {}) {
    const data = { published_at: new Date().toISOString() }
    return this.request({ method: 'PATCH', action: 'publish', params: [this.primaryKey()], data, ...configs })
}
```

When creating your custom static actions don't forget to set up `isStatic: true` and to call `(new this).request(...)` instead of `this.request(...)`. For example:

```js
static allWithTag (tag, configs = {}) {
    const query = { search: tag }
    return (new this).request({ method: 'GET', isStatic: true, query, ...configs })
}
```

Note that here I did not bother giving the action a name so it will default to `custom`.