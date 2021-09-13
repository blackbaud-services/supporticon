# Goal

Helpers related to fetching pages sorted by funds raised.

- [fetchLeaderboard](#fetchleaderboard)
- [deserializeLeaaderboard](#deserializeleaderboard)


## `fetchLeaderboard`

**Purpose**

Fetch pages from JustGiving sorted by funds raised.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered


```javascript
import { fetchLeaderboard } from 'supporticon/api/leaderboard'

fetchLeaderboard({
  charity: 'example-charity'
  campaign: 'example-campaign'
})
```

## `deserializeLeaderboard`

A default deserializer for deserializing fundraising leaderboard pages

**Params**

- `data` {Object} a single fundraising page to deserialize

**Returns**

The deserialized fundraising page

**Example**

```javascript
import { deserializeLeaderboard } from 'supporticon/api/leaderboard'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializeLeaderboard)
}
```
