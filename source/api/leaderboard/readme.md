# Goal

Helpers related to fetching pages sorted by funds raised.

- [fetchLeaderboard](#fetchleaderboard)
- [deserializeLeaaderboard](#deserializeleaderboard)


## `fetchLeaderboard`

**Purpose**

Fetch pages from Supporter sorted by funds raised.

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchLeaderboard } from 'supporticon/api/leaderboard'

fetchLeaderboard({
  campaign: 'au-123'
})
```

## `deserializeLeaderboard`

A default deserializer for deserializing supporter leaderboard pages

**Params**

- `data` {Object} a single supporter page to deserialize

**Returns**

The deserialized supporter page

**Example**

```javascript
import { deserializeLeaderboard } from 'supporticon/api/leaderboard'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializeLeaderboard)
}
```
