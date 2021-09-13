# Campaigns

Helpers related to fetching campaigns

- [fetchCampaigns](#fetchcampaigns)
- [fetchCampaign](#fetchcampaign)
- [deserializeCampaign](#deserializecampaign)


## `fetchCampaigns`

**Purpose**

Fetch a listing of campaigns.

**Params**

- `params` (Object) see [parameter list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchCampaigns } from 'supporticon/api/campaigns'

fetchCampaigns({
  ids: ['96e2266e-2fa2-4109-a2b6-c017b79011bd']
})
```

## `fetchCampaign`

**Purpose**

Fetch a single campaigns.

**Params**

- `id` The id of the campaign

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchCampaign } from 'supporticon/api/campaigns'

fetchCampaign('96e2266e-2fa2-4109-a2b6-c017b79011bd')
```

## `deserializeCampaign`

A default deserializer for deserializing campaigns

**Params**

- `data` {Object} a single campaign to deserialize

**Returns**

The deserialized campaign

**Example**

```javascript
import { deserializeCampaign } from 'supporticon/api/campaign'

// when dealing with multiple campaigns
return {
  status: 'fetched',
  data: payload.data.map(deserializeCampaign)
}

// when dealing with a single campaign
return {
  status: 'fetched',
  data: deserializeCampaign(payload.data)
}
```
