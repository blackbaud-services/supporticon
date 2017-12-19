# Goal

Helpers related to authenticating through [the Partner API](http://developer.everydayhero.com/partner/custom-authentication/)

- [signIn](#signin)
- [signUp](#signup)
- [resetPassword](#resetpassword)

## `signIn`

**Purpose**

Login EDH user with email and password

**Params**

- `params` (Object)

- `client_id` (String) Public OAuth Client ID.
- `email` (String) The email address of the user.
- `password` (String) The password of the user.
- `country` (String) The country of the user. Defaults to 'au'

**Example**

```javascript
import { signIn } from 'supporticon/api/authentication'

signIn({
  client_id: process.env.API_CLIENT_ID,
  email: 'professionalservices@everydayhero.com.au',
  password: '********'
})
```


## `signUp`

**Purpose**

Signup new EDH user.

**Params**

- `params` (Object)

- `client_id` (String) Public OAuth Client ID.
- `name` (String) The full name of the user.
- `email` (String) The email address of the user.
- `password` (String) The password of the user.
- `phone` (String) The phone number of the user.
- `country` (String) The country of the user. Defaults to 'au'

**Example**

```javascript
import { signIn } from 'supporticon/api/authentication'

signUp({
  client_id: process.env.API_CLIENT_ID,
  name: 'Professional Services'
  email: 'professionalservices@everydayhero.com.au',
  password: '********',
  phone: '1300 798 768'
})
```


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
