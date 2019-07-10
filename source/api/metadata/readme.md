# Goal

Helpers related to both the [EDH](http://developer.everydayhero.com/metadata) and [Digital Solutions](https://metadata.blackbaud.services/docs) Metadata services

- [fetchMetadata](#fetchmetadata)
- [createMetadata](#createmetadata)
- [updateMetadata](#updatemetadata)

## `fetchMetadata`

**Purpose**

Fetch metadata for a given user/page

**Params**

- `token` (String) User Token _required_
- `id` (String) User Page ID _required for JG_
- `app` (String) Metadata app (JG only)
- `type` (String) Metadata Type (EDH only)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchMetadata } from 'supporticon/api/metadata'

fetchMetadata({
  id: '123',
  token: 'abc'
})
```


## `createMetadata`

**Purpose**

Create metadata for a given user/page

**Params**

- `token` (String) User Token _required_
- `id` (String) User Page ID _required_
- `metadata` (Object) Metadata Key / Value pairs _required_
- `app` (String) Metadata app (JG only)
- `type` (String) Metadata Type (EDH only)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { createMetadata } from 'supporticon/api/metadata'

createMetadata({
  id: '123',
  token: 'abc'
  metadata: {
    key: 'value',
    another: 'goes here'
  }
})
```


## `updateMetadata`

**Purpose**

Update metadata key/value pair

**Params**

- `token` (String) User Token _required_
- `id` (String) Metadata ID _required_
- `key` (String) Metadata Key _required_
- `value` (String) Metadata Value _required_
- `app` (String) Metadata app (JG only)
- `type` (String) Metadata Type (EDH only)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { createMetadata } from 'supporticon/api/metadata'

createMetadata({
  id: '123',
  key: 'meta',
  value: 'data',
  token: 'token'
})
```
