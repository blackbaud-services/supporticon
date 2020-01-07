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

Fetch teams for an authenticated user.

**Params**

- `token` (String) OAuth User Token _required_

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchTeams } from 'supporticon/api/teams'

fetchTeams({
  token: 'abcd-123456'
})
```


## `fetchTeam`

**Purpose**

Fetch a specific team by id.

**Params**

- `id` (Integer) Team ID _required_
- `token` (String) OAuth User Token _required EDH only_

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { fetchTeam } from 'supporticon/api/teams'

fetchTeam({
  id: 1234,
  token: 'abcd-123456'
})
```


## `createTeam`

Create a team for an authenticated user.

**Params**

- `token` (String) OAuth User Token _required_
- `page` (Integer) Page ID _required_
- `name` (String) Team Name

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { createTeam } from 'supporticon/api/teams'

createTeam({
  token: 'xxxxx',
  page: 1234,
  name: 'My Team'
})
```


## `joinTeam`

Create a team for an authenticated user.

**Params**

- `token` (String) OAuth User Token _required_
- `page` (Integer) Page ID _required_
- `id` (Integer) Team ID _required_

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { joinTeam } from 'supporticon/api/teams'

joinTeam({
  token: 'xxxxx',
  page: 1234,
  id: 4321
})
```
