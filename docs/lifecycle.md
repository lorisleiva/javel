# The lifecycle of a model

When creating your own mixin, you will likely need to hook into when a new model is created. Javel provides a very basic `BaseModel` (not to confuse with its `Model` that you'd probably alias as `BaseModel`) which implement three simple methods.

- The `constructor` delegates immidiately to the `fill` methods and does nothing else.
- The `fill` method will be called everytime we want to update the content of our models.
- The `make` method instanciate a new object which will call the `constructor` which in turn will call the `fill` method.

![Lifecycle](https://user-images.githubusercontent.com/3642397/51778452-9cbba700-20f9-11e9-86dc-d69fe57bbf28.png)

Therefore when creating mixins, you will often need to extend the behavior of the `fill` method by doing something like this:

```js
fill (...args) {
    super.fill(...args)
    this.doSomethingWith(args)
    return this
}
```

Note that this is how most native mixins add their behavior to the BaseModel. For example, this is how the `HasAttributes` mixins sets attributes automatically:

```js
fill (attributes = {}, ...args) {
    super.fill(attributes, ...args)
    this.setAttributes(attributes)
    return this
}
```