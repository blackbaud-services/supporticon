# Goal

Helpers related to fetching donation totals for charities, campaigns etc.

- [fetchDonationTotals](#fetchdonationtotals)
- [deserializeDonationTotals](#deserializedonationtotals)


## `fetchDonationTotals`

**Purpose**

Fetch donation totals from JustGiving.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchDonationTotals } from 'supporticon/api/donation-totals'

fetchDonationTotals({
  campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
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
