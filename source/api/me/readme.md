# Goal

Helpers related to fetching and updating an authenticated user with a provided Auth token.

- [signIn](#signin)
- [signUp](#signup)

## `fetchCurrentUser`

**Purpose**

Fetch current user details

**Params**

- `params` (Object)

- `token` (String) User Token _required_

**Example**

```javascript
import { fetchCurrentUser } from 'supporticon/api/me'

fetchCurrentUser({ token: 'abcdef123456' })
```


## `updateCurrentUser`

**Purpose**

Update current user name, email, and/or address

**Params**

- `params` (Object)

- `token` (String) User Token _required_
- `uuid` (String) User GUID _required_
- `email` (String) Email address
- `firstName` (String) First Name
- `lastName` (String) Last Name
- `address` (String) Formatted address

**Example**

```javascript
import { updateCurrentUser } from 'supporticon/api/me'

updateCurrentUser({
  token: 'abcdef123456',
  uuid: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
  email: 'test@test.co',
  firstName: 'Test'
})
```
