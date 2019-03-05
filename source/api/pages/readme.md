# Goal

Helpers related to fetching supporter pages

- [fetchPages](#fetchpages)
- [fetchPage](#fetchpage)
- [fetchPageDonationCount](#fetchpagedonationcount)
- [deserializePage](#deserializepage)
- [createPage](#createpage)
- [updatePage](#updatepage)


## `fetchPages`

**Purpose**

Fetch pages from Supporter.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)
- `allPages` (Boolean) Use `api/v2/pages` endpoint (EDH only)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchPages } from 'supporticon/api/pages'

fetchPages({
  campaign: 'au-123'
})
```

## `fetchPage`

**Purpose**

Fetch a single page.

**Params**

- `id` - the page id

**Returns**

A pending promise that will either resolve to:

- Success: the page data
- Failure: the error encountered

**Example**

```javascript
import { fetchPage } from 'supporticon/api/pages'

fetchPage('12345')
```

## `fetchPageDonationCount`

**Purpose**

Fetch a single page's donation count.

**Params**

- `id` - the page id

**Returns**

A pending promise that will either resolve to:

- Success: the number of donations received by that page
- Failure: the error encountered

**Example**

```javascript
import { fetchPage } from 'supporticon/api/pages'

fetchPage('12345')
```

## `deserializePage`

A default deserializer for deserializing supporter pages

**Params**

- `data` {Object} a single supporter page to deserialize

**Returns**

The deserialized supporter page

**Example**

```javascript
import { deserializePage } from 'supporticon/api/pages'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializePage)
}
```

## `createPage`

Create a Supporter page for an authenticated User.

See [the API documentation](http://developer.everydayhero.com/pages/#create-an-individual-page) for more information.

**Params**

- `token` (String) OAuth User Token _required_
- `campaignId` (String) Campaign UID _required_
- `birthday` (String) User Date of Birth _required_
- `charityId` (String) Charity UID
- `image` (String) Image URL for page avatar
- `name` (String) Page Name
- `nickname` (String) Page Nickname
- `slug` (String) Page URL slug
- `target` (String) Page fundraising target/goal (in cents)
- `expiresAt` (String) Page expiry date
- `skipNotification` (Boolean) Skip notification email
- `fitnessGoal` (String) Page fitness goal (in metres)
- `campaignDate` (String) Optional page date
- `groupValues` (Hash/Array) Campaign group values for the page
- `inviteToken` (String) Team invite token

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { createPage } from 'supporticon/api/pages'

createPage({
  token: 'xxxxx',
  campaignId: 'au-123',
  birthday: '1970-01-01',
  name: 'Test User',
})
```

## `updatePage`

Update an existing Supporter page for an authenticated User.

**Params**

- `pageId` (String/Integer) User page id
- `params` (Object) Containing the following:
  - `token` (String) OAuth User Token _required_
  - `name` (String) Page Name
  - `target` (String) Page fundraising target/goal (in cents)
  - `slug` (String) Page URL slug
  - `story` (String) Page story
  - `image` (String) Image URL for page avatar
  - `expiresAt` (String)
  - `fitnessGoal` (String) Page fitness goal (in metres)
  - `campaignDate` (String) Optional page date
  - `groupValues` (Hash/Array) Campaign group values for the page

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { updatePage } from 'supporticon/api/pages'

updatePage(123, {
  token: 'xxxxx',
  story: 'This is an updated story'
})
```
