# Goal

Helpers related to fetching the number of pages for campaigns, charities etc.

- [fetchPagesTotals](#fetchpagestotals)


## `fetchPagesTotals`

**Purpose**

Fetch number of pages from JustGiving.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchPagesTotals } from 'supporticon/api/pages-totals'

fetchPagesTotals({
  campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
})
```
