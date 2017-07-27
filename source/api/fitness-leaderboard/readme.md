# Goal

Helpers related to fetching pages sorted by fitness activities.

- [Configuration](#configuration)
- [fetchFitnesseaderboard](#fetchfitnessleaderboard)
- [deserializeFitnessLeaaderboard](#deserializefitnessleaderboard)

## Configuration

- `namespace` - app/leaderboard
- `endpoint` - api/v2/search/fitness_activities_totals

## `fetchLeaderboard`

**Purpose**

Fetch pages from Supporter sorted by fitness activities.

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchFitnessLeaderboard } from 'supporticon/api/fitness-leaderboard'

fetchFitnessLeaderboard({
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
import { deserializeFitnessLeaderboard } from 'supporticon/api/leaderboard'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializeFitnessLeaderboard)
}
```
