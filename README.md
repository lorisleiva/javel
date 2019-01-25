# Javel
🎁 Simple, lightweight and customisable Laravel models in your JavaScript

## Installation

```sh
npm i javel -D
```

## Overview

```js
import Model from 'javel'

class Article extends Model {/* ... */}

await Article.all({ /* request */ })                        // => [ Article* ]
await Article.paginate({ data: { page: 2 } })               // => { data: [ Article* ], current_page: 2, ... }
await Article.find(1)                                       // => Article { id: 1, ... }

let article = await Article.create({ name: 'My article' })  // => Article { id: 2, name: 'My article' }
await article.update({ name: 'My updated article' })        // => Article { id: 2, name: 'My updated article' }
await article.delete()                                      // => Deleted from the server

article = new Article({ name: 'My draft blog post' })
article.name = 'My new blog post'
await article.save()                                        // => Article { id: 3, name: 'My new blog post', ... }
```

## Getting started

Start by creating your base model that all other models will extends from. In there you can override any logic you want or, even better, attach additional behavior using mixins ([see below]()).

```js
import { Model as BaseModel } from 'javel'

export default class Model extends BaseModel {
    //
}
```

Typically, in this base model, you would set up how to reach your server by overriding the `baseUrl` and `makeRequest` methods like this:

```js
export default class Model extends BaseModel {
    baseModel () {
        return '/api'
    }
    makeRequest ({ method, url, data, query }) {
        return axios({ method, url, data, params: query })
    }
}
```

Note that `baseModel` defaults to `/api` and that `makeRequest` will automatically use axios if it available in the `window` (which is the case by default in Laravel).

Next, create specific models for your application.

```js
import Model from './Model.js'

export default class Article extends Model {
    // Your logic here...
}
```

Finally you will likely want to configure which URL should be used for each actions (find, create, update, etc.). You might also want to add some behavior right before or after requests are made and customize how to handle the response. You can learn all about this in the [documentation of the `MakesRequests` mixin](TODO).

## A chain of mixins

Javel uses the [mixwith library](TODO) to separate each fonctionality of a Model into dedicated mixins (comparable to how Eloquent uses traits in Laravel). For the sake of convenience, Javel exposes the mixwith's API directly:

```js
import { Model as BaseModel, Mixin, mix } from 'javel'

// Create a mixin
const ImmutableModels = Mixin(superclass => class extends superclass {
    //
})

// Use a mixin
class Model extends mix(BaseModel).with(ImmutableModels) {
    //
}
```

You can of course combine as many mixins as you want.

```js
import { Model as BaseModel, mix } from 'javel'
import { MixinA, MixinB, MixinC } from './mixins'

// Use a mixin
class Model extends mix(BaseModel).with(MixinA, MixinB, MixinC) {
    //
}
```

Note that the order in which you use your mixins is important. The mixins will be applied using inheritance from right to left. Therefore the previous example is comparable to:

```js
class MixinA extends BaseModel {}
class MixinB extends MixinA {}
class MixinC extends MixinB {}
class Model extends MixinC {}
```

## Mixins included in Javel's Model

By default, the base Model provided by javel includes the following mixins (in this order, i.e. the lower overrides the higher). You can learn more about each of them by reading their dedicated documentation.

- [HasAttributes](TODO) Defines the basis of getting and setting attributes on a Model and provide some useful methods like `primaryKey`, `exists`, `is`, `clone`, etc.
- [HasRelationships](TODO) Enables models to configure their relationships with each other so that their attributes are automatically wrapped in the right model.
- [KeepsParentRelationship](TODO) Ensures each child relationship keeps track of its parent and how to access itself from it. This enables models to climb up the relationship tree and even remove themselves from their parent when deleted.
- [MakesRequests](TODO) Introduces async actions (`find`, `create`, `update`, etc.) to conveniently request the server and provides all the hooks necessary to customize how to handle your request/response proctol for each model.


## Extra mixins available

Javel also provides some additional mixins that can be useful to plug in or to get inspired from when writing your own. Don't hesitate to PR your best mixins and share it with us.

- [GeneratesUniqueKey](TODO) Attaches a unique key to every new model instanciated. If the model has a primary key available, the primary key will be used instead of generating a new unique key.
- [UsesMethodFieldWithFormData](TODO) Transforms the `update` action to use the `POST` method with the `_method=PATCH` field when the provided data is an instance of FormData.
