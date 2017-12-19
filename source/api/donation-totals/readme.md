# Goal

Helpers related to fetching donation totals for charities, campaigns etc.

- [fetchDonationTotals](#fetchdonationtotals)
- [deserializeDonationTotals](#deserializedonationtotals)


## `fetchDonationTotals`

**Purpose**

Fetch donation totals from Supporter.

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchDonationTotals } from 'supporticon/api/donation-totals'

fetchDonationTotals({
  campaign: 'au-123'
})
```

## `deserializeDonationTotals`

A default deserializer for deserializing donation totals

**Params**

- `data` {Object} a totals object to deserialize

**Returns**

The deserialized totals

**Example**

```javascript
import { deserializeDonationTotals } from 'supporticon/api/donation-totals'

// ...

return {
  status: 'fetched',
  data: deserializeDonationTotals(payload.data)
}
```
