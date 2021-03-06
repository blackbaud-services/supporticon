# Goal

Helpers related to fetching the number of pages for campaigns, charities etc.

- [fetchPagesTotals](#fetchpagestotals)


## `fetchPagesTotals`

**Purpose**

Fetch number of pages from Supporter.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)
- `search` (Boolean) Use `api/v2/search/pages` endpoint (EDH only)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchPagesTotals } from 'supporticon/api/pages-totals'

fetchPagesTotals({
  campaign: 'au-123'
})
```
