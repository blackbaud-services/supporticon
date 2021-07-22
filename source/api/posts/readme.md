# Goal

Helpers related to fetching & creating page posts

- [createPost](#createPost)

## `createPost`

Create a post

**Params**

- `token` (String) User Token _required_
- `pageId` (String) Page GUID _required_
- `userId` (String) User GUID _required_
- `message` (String)
- `image` (String)
- `video` (String)

**Returns**

A pending promise that will either resolve to:

- Success: the created post
- Failure: the error

**Example**

```javascript
import { createPost } from 'supporticon/api/posts'

createPost({
  token: 'xxxxx',
  pageId: 'f440df6c-1101-4331-ac78-4fc5bc276f4e',
  userId: '95c0c89f-468c-4a6e-84dd-08a75cbc96ca',
  message: 'This is a post!'
})
```
