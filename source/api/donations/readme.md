# Goal

Helpers related to interacting with donations

- [replyToDonation](#replyToDonation)

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
import { replyToDonation } from 'supporticon/api/replyToDonation'

replyToDonation({
  pageId: 12345,
  donationId: 'au-1234',
  caption: 'Thanks mate'
})
```
