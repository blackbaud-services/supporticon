# Goal

Helpers related to interacting with donations

- [fetchDonation](#fetchDonation)
- [replyToDonation](#replyToDonation)
- [deserializeDonation](#deserializeDonation)

## `fetchDonation`

**Purpose**

Fetch donation by ID (JG only)

**Params**

- `id` - the donation id

**Returns**

A pending promise that will either resolve to:

- Success: the donation data
- Failure: the error encountered

**Example**

```javascript
import { fetchDonation } from 'supporticon/api/donations'

fetchDonation('12345')
```


## `replyToDonation`

Replies to a donation

**Params**

- `token` (string)
- `pageId` (string or integer)
- `donationId` (string)
- `caption` (string)

**Returns**

A pending promise that will either resolve to:

- Success: the created reply
- Failure: the error

**Example**

```javascript
import { replyToDonation } from 'supporticon/api/donations'

replyToDonation({
  pageId: 12345,
  donationId: 'au-1234',
  caption: 'Thanks mate'
})
```

## `deserializeDonation`

A default deserializer for deserializing donations

**Params**

- `data` {Object} a single donation to deserialize

**Returns**

The deserialized donation

**Example**

```javascript
import { deserializeDonation } from 'supporticon/api/donations'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializeDonation)
}
```
