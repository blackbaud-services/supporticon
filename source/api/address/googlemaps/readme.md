# Goal

Helpers related to looking up addresses using Services API endpoints that leverage GoogleMaps API.

- [setSessionToken](#setSessionToken)
- [getAddressSuggestions](#getAddressSuggestions)
- [getPlaceDetail](#getPlaceDetail)
- [deserializePlace](#deserializePlace)

## `setSessionToken`

**Purpose**

Set a session token for purposes of grouping requests together for billing purposes from Google. Google defines a session as starting with the first initial autocomplete query (getAddressSuggestion). The session continues until a query on a specific place is submitted (getPlaceDetail). At this point a new session token should be generated for subsuqent autocomplete queries. [Read more](https://developers.google.com/places/web-service/session-tokens) about Google requirements on setting tokens.


**Returns**

A random generated string that can be used to pass a session token when using getAddressSuggestions and getPlaceDetail methods.

**Example**

```javascript
import { setSessionToken } from 'supporticon/api/address/googlemaps'

const [sessiontoken, setToken] = useState(setSessionToken())
```

## `getAddressSuggestions`

Pass query to get list of address suggestions for autocomplete search.

**Params**

- `q` (String) the search query _required_
- `country` (String) restrict search by country (au,us,uk)
- `sessiontoken` (String) random generated string (see [setSessionToken](#setSessionToken))

**Returns**

Array of address suggestions. Each has a place id that can be used to query for address details using [getPlaceDetail](#getPlaceDetail).

**Example**

```javascript
import { getAddressSuggestions } from 'supporticon/api/address/googlemaps'

getAddressSuggestions({
  q: '33 Ann St',
  country: 'au',
  sessiontoken: 'a6ve8ww3ypk15950180282239ppq8sv2cs4'
})
```

## `getPlaceDetail`

Given an address id from result getAddressSuggestions, get the address details

**Params**

- id` (String) the place_id returned from getAddressSuggestions _required_
- `sessiontoken` (String) random generated string (see [setSessionToken](#setSessionToken))

**Returns**

Object of address details, includes address_components object, which can be passed through [deserializePlace](#deserializePlace) to format address in order to set updateAccount in JustGiving.

**Example**

```javascript
import { getPlaceDetail } from 'supporticon/api/address/googlemaps'

getPlaceDetail({
  id: 'ChIJnUk-3R9akWsRAH4BjWado0M',
  sessiontoken: 'ahblmxyp6k1595042869466jpljrwl631r'
})
```

## `deserializePlace`

Deserializer response from GoogleMaps API to format address to be used in JustGiving.

**Params**

- `data` {Object} the address_component object returned from getPlaceDetail

**Returns**

Deserialized address that can be used to set address with JustGiving API.

**Example**

```javascript
import { deserializePlace } from 'supporticon/api/address/googlemaps'

getPlaceDetail({
  id: 'ChIJnUk-3R9akWsRAH4BjWado0M',
  sessiontoken: 'ahblmxyp6k1595042869466jpljrwl631r'
})
.then(data => deserializePlace(data))
```

