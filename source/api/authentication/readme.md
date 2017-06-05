# Goal

Helpers related to authenticating through [the Partner API](http://developer.everydayhero.com/partner/custom-authentication/)

- [Configuration](#configuration)
- [resetPassword](#fetchauthentication)

## Configuration

- `namespace` - app/authentication
- `endpoint` - api/v2/authentication

## `resetPassword`

**Purpose**

Send reset password email to user

**Params**

- `params` (Object)

- `client_id` (String) Public OAuth Client ID.
- `email` (String) The email of the user.

**Returns**

A pending promise that will either resolve to:

- Success: `204` No Content
- Failure: the error encountered

**Example**

```javascript
import { resetPassword } from 'supporticon/api/authentication'

resetPassword({
  client_id: process.env.API_CLIENT_ID,
  email: 'professionalservices@everydayhero.com.au'
})
```
