# Goal

Helpers related to fetching teams

- [deserializeTeam](#deserializeteam)
- [fetchTeams](#fetchteams)
- [fetchTeam](#fetchteam)
- [createTeam](#createteam)
- [joinTeam](#updateteam)

## `deserializeTeam`

A default deserializer for deserializing teams

**Params**

- `data` {Object} a single team to deserialize

**Returns**

The deserialized team

**Example**

```javascript
import { deserializeTeam } from 'supporticon/api/teams'

// ...

return {
  status: 'fetched',
  data: payload.data.map(deserializeTeam)
}
```


## `fetchTeams`

**Purpose**

Fetch teams for a campaign

**Params**

- `campaign` (String) Campaign GUID _required_

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchTeams } from 'supporticon/api/teams'

fetchTeams({
  campaignGuid: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
})
```

## `fetchTeam`

**Purpose**

Fetch a specific team by GUID.

**Params**

- `id` (Integer) Team GUID _required_

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchTeam } from 'supporticon/api/teams'

fetchTeam({
  id: '95c0c89f-468c-4a6e-84dd-08a75cbc96ca'
})
```


## `createTeam`

Create a team for an authenticated user.

**Params**

- `token` (String) User Token _required_
- `name` (String) Team Name _required_
- `campaignId` (String) Campaign GUID _required_
- `story` (String) Team story _required_
- `captainSlug` (String) Team captain page slug _required_
- `coverPhotoId` (String)
- `slug` (String)
- `target` (String)
- `targetType` (String)
- `targetCurrency` (String)
- `teamType` (String)

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { createTeam } from 'supporticon/api/teams'

createTeam({
  token: 'xxxxx',
  name: 'My Team',
  campaignId: 'f440df6c-1101-4331-ac78-4fc5bc276f4e',
})
```


## `joinTeam`

Create a team for an authenticated user.

**Params**

- `token` (String) User Token _required_
- `pageSlug` (Integer) Page slug _required_
- `teamSlug` (Integer) Team slug _required_

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { joinTeam } from 'supporticon/api/teams'

joinTeam({
  token: 'xxxxx',
  pageSlug: 'page',
  teamSlug: 'team'
})
```
