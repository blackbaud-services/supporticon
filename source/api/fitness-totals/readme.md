# Goal

Helpers related to fetching fitness activities for a campaign.

- [fetchFitnessSummary](#fetchFitnessSummary)
- [fetchFitnessTotals](#fetchFitnessSummary)

## `fetchFitnessTotals`

**Purpose**

Fetch the total of all fitness activity for a campaign.

**Params**

- `campaign` (String, Array)
  - a campaign id
  - an array of campaign ids
- `types` (String, Array) optional. Which fitness activity types to include
  - a single fitness type to include (e.g. `'walk'`)
  - an array of fitness types to include (e.g. `['run', 'walk', 'swim']`)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchFitnessTotals } from 'supporticon/api/fitness-totals'

fetchFitnessTotals('au-123')
```

## `fetchFitnessSummary`

**Purpose**

Fetch a summary of all fitness activity for a campaign, broken down into categories.

**Params**

- `campaign` (String, Array)
  - a campaign id
  - an array of campaign ids
- `types` (String, Array) optional. Which fitness activity types to include
  - a single fitness type to include (e.g. `'walk'`)
  - an array of fitness types to include (e.g. `['run', 'walk', 'swim']`)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchFitnessSummary } from 'supporticon/api/fitness-totals'

fetchFitnessSummary('au-123')
```
