# Goal

Helpers related to fetching fitness totals for a campaign.

- [fetchFitnessTotals](#fetchfitnesstotals)

## `fetchFitnessTotals`

**Purpose**

Fetch the total of all fitness activity for a campaign.

**Params**

- `campaign` (String, Array)
  - a campaign id
  - an array of campaign ids

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchFitnessTotals } from 'supporticon/api/fitness-totals'

fetchFitnessTotals({
  campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
})
```
