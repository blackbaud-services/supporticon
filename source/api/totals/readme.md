# Goal

Helpers related to fetching totals

- [Configuration](#configuration)
- [fetchTotals](#fetchtotals)
- [deserializeTotals](#deserializetotals)

## Configuration

- `namespace` - app/totals
- `endpoint` - api/v2/search/totals

## `fetchTotals`

**Purpose**

Fetch totals from Supporter.

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchTotals } from 'supporticon/api/totals'

fetchTotals({
  campaign: 'au-123'
})
```

## `deserializeTotals`

A default deserializer for deserializing totals

**Params**

- `data` {Object} a totals object to deserialize

**Returns**

The deserialized totals

**Example**

```javascript
import { deserializeTotals } from 'supporticon/api/totals'

// ...

return {
  status: 'fetched',
  data: deserializeTotals(payload.data)
}
```
