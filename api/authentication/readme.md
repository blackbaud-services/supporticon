# Goal

Helpers related to authenticating users with JustGiving.

- [signIn](#signin)
- [signUp](#signup)
- [resetPassword](#resetpassword)

## `signIn`

**Purpose**

Login JG user with email and password

**Params**

- `params` (Object)

- `email` (String) The email address of the user.
- `password` (String) The password of the user.

**Example**

```javascript
import { signIn } from 'supporticon/api/authentication'

signIn({
  email: 'professionalservices@everydayhero.com.au',
  password: '********'
})
```


## `signUp`

**Purpose**

Signup new JG user.

**Params**

- `params` (Object)

- `email` (String) The email address of the user.
- `password` (String) The password of the user.
- `firstName` (String) The first name of the user.
- `lastName` (String) The last name of the user.
- `address` (Object) The users' address

**Example**

```javascript
import { signIn } from 'supporticon/api/authentication'

signUp({
  email: 'professionalservices@everydayhero.com.au',
  password: '********',
  firstName: 'Professional',
  lastName: 'Services'
})
```


## `resetPassword`

**Purpose**

Send reset password email to user

**Params**

- `params` (Object)

- `email` (String) The email of the user.

**Returns**

A pending promise that will either resolve to:

- Success: `204` No Content
- Failure: the error encountered

**Example**

```javascript
import { resetPassword } from 'supporticon/api/authentication'

resetPassword({
  email: 'professionalservices@everydayhero.com.au'
})
```
