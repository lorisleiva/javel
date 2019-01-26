# HasAttributes

| method | type | description |
| - | - | - |
| `setAttributes` | new | Set/update the attributes on the model. |
| `getAttributes` | new | Get all of the current attributes on the model. |
| `primaryKey` | new | Retrieve the primary key on the model. Defaults to `model.id`. |
| `exists` | new | Indicates if the model exists on the server side, i.e. has a primary key. |
| `is` | new | 	Determines whether two model have the same primary key.  |
| `clone` | new | Generates a new model with identical (one-level deep copied) attributes. |
| `fill(attributes, ...args)` | [extends](lifecycle.md) | Uses the first argument to set the attributes. |
| `make(attributes, ...args)` | [extends](lifecycle.md) | Instanciates a model or an array of models with the given attributes. |

## Setting attributes directly on the object

By default, Javel sets the attributes directly on the model like this:

```js
setAttributes (attributes) {
    Object.assign(this, attributes)
}

getAttributes () {
    return { ...this }
}
```

This enables us to access the attributes directly on the object (e.g. `article.name`) and play nicely with frameworks like Vue.js when you need to do a `v-model="article.name"`.

However it comes with a tradeoff. When calling `setAttributes` multiple time, old values will not be cleared (like it would in Laravel). Consider the following example:

```js
article = new Article({ name: 'My blog post' }) // => Article { name: 'My blog post' }
article.setAttributes({ views: 320 })           // => Article { name: 'My blog post', views: 320 }
```

Has you can see the `name` of the article is still present on the model even though the new set of provided attributes doesn't include it. Whilst this might not seem like a big deal, it can be problematic when responses from your server removes attributes (usually relationships). In this case you will likely want to override the `setAttributes` method to reset those attributes that might disappear.

```js
setAttributes (attributes) {
    this.author = undefined
    super.setAttributes(attributes)
}
```

## Customize the setting/getting attributes strategy

If the default strategy used to set/get attributes doesn't suit your project, you can easily override those methods to provide the logic of your choice. The main point to keep in mind is that `setAttributes` and `getAttributes` should be complementary. That is `getAttributes(setAttributes(attributes))` and `attribute` should be equal by value. Here are a couple of examples.

### Attributes within a private variable

```js
setAttributes (attributes) { this._attributes = attributes }
getAttributes () { return this._attributes }
get(key) { return this._attributes[key] }
set(key, value) { this._attributes[key] = value }
```

**Pros.** You don't have the problem of having to reset attributes that could be removed since the entire attribute object is replaced every time. \
**Cons.** You cannot access attributes directly on the model like `article.name`. Instead you need to use `article.get('name')`. If you use Vue.js that means `v-model="article.name"` becomes `:value="article.get('name')" @input="val => article.set('name', val)"`.

### Use proxies to access the private attribute variable

```js
constuctor (...args) {
    this.fill(...args)
    return new Proxy(this, { /* Proxy setting */ })
}
setAttributes (attributes) { this._attributes = attributes }
getAttributes () { return this._attributes }
```

**Pros.** Your proxy settings should now enable `this.article` to access `this._attributes.article` under the hood. Therefore we don't have the problem of resetting attributes *and* we can access attributes as if their were directly on the model. \
**Cons.** [Browser support is not great yet](https://caniuse.com/#feat=proxy) and no perfect polyfill exists.

## Customize the primary key

You can customize the primary key of your model by overriding the `primaryKey` method (Defaults to the `id` attribute).

```js
primaryKey () {
    const { user_id, role_id } = this.getAttributes()
    return user_id && role_id ? `${user_id}-${role_id}` : null
}
```

Note that if `model.primaryKey()` evaluates to true, Javel assumes the model `exists` on the server (hence the ternary conditional on the example above).
