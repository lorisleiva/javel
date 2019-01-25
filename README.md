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

let article = await Article.create({ name: 'My blog post' })

await article.update({ name: 'My updated blog post' })

await article.delete()

article = await Article.find(1)
// => Article { id: 1, ... }

articles = await Article.all({ /* request */ })
// => [Article*]

articles = await Article.paginate({ data: { page: 2 } })
// => { data: [Article*], current_page: 2, ... }

article = new Article({ name: 'My draft blog post' })
article.name = 'My new blog post'
await article.save()
// => Article { id: 2, name: 'My new blog post', ... }
```


## Getting started

```js
import { Model as BaseModel } from 'javel'

class Model extends BaseModel {
    //
}
```
