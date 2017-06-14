# Goal

Helpers related to fetching and updating an authenticated user with a provided OAuth token.

See [the developer docs](http://developer.everydayhero.com/users/) for more information

- [Configuration](#configuration)
- [signIn](#signin)
- [signUp](#signup)
- [resetPassword](#resetpassword)

## Configuration

- `namespace` - api/v1/me
- `endpoint` - app/me


## `fetchCurrentUser`

**Purpose**

Fetch current user details

**Params**

- `params` (Object)

- `token` (String) OAuth User Token

**Example**

```javascript
import { fetchCurrentUser } from 'supporticon/api/me'

fetchCurrentUser({ token: 'abcdef123456' })
```


## `updateCurrentUser`

**Purpose**

Update current user birthday, phone number, and/or address

**Params**

- `params` (Object)

- `token` (String) OAuth User Token
- `address` (String) Formatted address
- `birthday` (String) Date in the format: `YYYY-MM-DD`
- `phone` (String) Phone number

**Example**

```javascript
import { updateCurrentUser } from 'supporticon/api/me'

updateCurrentUser({
  token: 'abcdef123456',
  birthday: '1970-01-01'
})
```
