# Goal

Helpers related to fetching charities

- [searchCharities](#searchcharities)

## `searchCharities`

**Purpose**

Search charities

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the matching charities
- Failure: the error

**Example**

```javascript
import { searchCharities } from 'supporticon/api/charities'

searchCharities({ campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e' })
```
