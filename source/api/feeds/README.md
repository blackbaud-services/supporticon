# Goal

Helpers related to fetching activity feeds

- [fetchDonationFeed](#fetchdonationfeed)

## `fetchDonationFeed`

**Purpose**

Fetch a donation activity feed.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchDonationFeed } from 'supporticon/api/feeds'

fetchDonationFeed({
  campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
})
```

## `deserializeDonation`

A default deserializer for deserializing a donation

**Params**

- `data` {Object} a single donation

**Returns**

The deserialized donation

**Example**

```javascript
import { deserializeDonation } from 'supporticon/api/feeds'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializeDonation)
}
```
