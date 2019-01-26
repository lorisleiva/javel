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
    action,     // => (String) Which method triggered this request, e.g. 'find', 'create', 'save', etc. Defaults to 'custom'
    isStatic,   // => (Boolean) Whether the request was triggered by a static call, e.g. Article.create(). Defaults to false.
    ...rest     // => Anything else you want to attach to the request.
} = request
```

Note that if you send a request without explicitly providing an `url`, the url will be generated using the `buildUrl` method.

## Configure URLs (routing)

TODO: baseUrl + explain default (i.e. [...params] + minification problem) + how to customize using the request object

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