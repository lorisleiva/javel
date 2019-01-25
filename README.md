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

```js
import { Model as BaseModel } from 'javel'

class Model extends BaseModel {
    //
}
```

## A chain of mixins

TODO
