# Goal

Helpers related to fetching campaigns

- [fetchCampaigns](#fetchcampaigns)
- [fetchCampaign](#fetchcampaign)
- [fetchCampaignGroups](#fetchcampaigngroups)
- [deserializeCampaign](#deserializecampaign)


## `fetchCampaigns`

**Purpose**

Fetch a listing of campaigns.

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchCampaigns } from 'supporticon/api/campaigns'

fetchCampaigns({
  charity: 'au-28'
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

fetchCampaign('au-6839')
```

## `fetchCampaignGroups`

**Purpose**

Fetch the groups for a campaign.

**Params**

- `id` The id of the campaign

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchCampaignGroups } from 'supporticon/api/campaigns'

fetchCampaignGroups('au-6839')
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
