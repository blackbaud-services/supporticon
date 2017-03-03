# Goal

Helpers related to fetching supporter pages

- [Configuration](#configuration)
- [fetchLeaderboard](#fetchleaderboard)
- [deserializeLeaaderboard](#deserializeleaderboard)

## Configuration

- `namespace` - app/pages
- `endpoint` - api/v2/pages

## `fetchPages`

**Purpose**

Fetch pages from Supporter.

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchPages } from 'supporticon/api/pages'

fetchPages({
  campaign: 'au-123'
})
```

## `deserializePage`

A default deserializer for deserializing supporter pages

**Params**

- `data` {Object} a single supporter page to deserialize

**Returns**

The deserialized supporter page

**Example**

```javascript
import { deserializePage } from 'supporticon/api/pages'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializePage)
}
```
