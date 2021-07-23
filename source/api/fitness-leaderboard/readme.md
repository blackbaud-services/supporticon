# Goal

Helpers related to fetching pages sorted by fitness activities.

- [fetchFitnesseaderboard](#fetchfitnessleaderboard)
- [deserializeFitnessLeaaderboard](#deserializefitnessleaderboard)


## `fetchLeaderboard`

**Purpose**

Fetch pages from JustGiving sorted by fitness activities.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchFitnessLeaderboard } from 'supporticon/api/fitness-leaderboard'

fetchFitnessLeaderboard({
  campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
})
```

## `deserializeLeaderboard`

A default deserializer for deserializing fitness leaderboard pages

**Params**

- `data` {Object} a single fundraising page to deserialize

**Returns**

The deserialized fundraising page

**Example**

```javascript
import { deserializeFitnessLeaderboard } from 'supporticon/api/leaderboard'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializeFitnessLeaderboard)
}
```
