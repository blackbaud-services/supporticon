# Goal

Helpers related to fetching & creating page posts

- [createPost](#createPost)

## `createPost`

Create a post

**Params**

- `pageId` (string or integer)
- `caption` (string)
- `image` (string)

**Returns**

A pending promise that will either resolve to:

- Success: the created post
- Failure: the error

**Example**

```javascript
import { createPost } from 'supporticon/api/posts'

createPost({
  page: 12345,
  caption: 'I am making great progress',
  image: 'https://placehold.it/400x400'
})
```
