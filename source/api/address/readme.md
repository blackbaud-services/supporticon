# Goal

Helpers related to looking up addresses

- [searchAddress](#searchaddress)

## `searchAddress`

**Purpose**

Search for an address

**Params**

- `query` (String) the address query to search
- `region` (String) defaults to au

**Returns**

A pending promise that will either resolve to:

- Success: a list of matched addresses
- Failure: the error encountered

**Example**

```javascript
import { searchAddress } from 'supporticon/api/address'

searchAddress('1 foo street')
```

## `getAddressDetails`

Given an address id, get the address details

**Params**

- `query` (String) the id of the found address (see searchAddress)
- `region` (String) defaults to au

**Returns**

The address

**Example**

```javascript
import { getAddressDetails } from 'supporticon/api/feeds'

getAddressDetails(123)
```
