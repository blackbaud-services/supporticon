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

## `buildDonationUrl`

**Purpose**

Create donation URL link for fundraiser. Can set with either page slug or page id. (JG only)

**Params**

- `amount` - pre-selected donation amount when donation form loaded (number)
- `slug` - Page slug (string)
- `id` - Page Id (string)
- `reference` - donation reference to be applied to succesful donations (string)
- `exitUrl` - a redirect link for successful transactions, can pass back donation transaction in formation by using *JUST_GIVING_DONATION_ID* (string)

**Returns**

Formatted JustGiving donation url for fundraiser

**Example**

```javascript
import { buildDonationUrl } from 'supporticon/api/donations/justgiving'

buildDonationUrl({
  amount: 50,
  slug: 'test-page' ,
  reference: 'self-donate',
  exitUrl: `${process.env.APPLICATION_URL}/thank-you/JUSTGIVING-DONATION-ID`
})
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
