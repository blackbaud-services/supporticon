# Goal

Helpers related to looking up addresses

- [searchAddress](#searchaddress)

## `searchAddress`

**Purpose**

Search for an address

**Params**

- `postCode` (String) the UK postcode to search

**Returns**

A pending promise that will either resolve to:

- Success: a list of matched addresses
- Failure: the error encountered

**Example**

```javascript
import { searchAddress } from 'supporticon/api/address'

searchAddress('SW1A1AA')
```

## `getAddressDetails`

Given an address id, get the address details

**Params**

- `id` (String) the id of the found address (see searchAddress)

**Returns**

The address

**Example**

```javascript
import { getAddressDetails } from 'supporticon/api/address'

getAddressDetails(123)
```
