# Goal

Helpers related to fetching & creating fitness activities

- [fetchFitnessActivities](#fetchfitnessactivities)
- [createFitnessActivity](#createfitnessactivity)
- [deleteFitnessActivity](#deletefitnessactivity)

## `fetchFitnessActivities`

Fetches fitness activities

**Params**

- `startAt` (string/date-time)
- `endAt` (string/date-time)

**Returns**

A pending promise that will either resolve to:

- Success: the matching fitness activities
- Failure: the error

**Example**

```javascript
import { fetchFitnessActivities } from 'supporticon/api/fitness-activities'

fetchFitnessActivities({ campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e' })
```


## `createFitnessActivity`

Create a fitness activity for a page as an authenticated user.

**Params**

- `token` (String) OAuth User Token _required_
- `type` (String) Activity type _required_
- `userId` (String) User GUID _required_
- `pageId` (String) Fundraising page GUID _required_
- `distance` (Integer) Distance covered in any distance format. Requires `unit`, otherwise defaults to metres
- `duration` (String) Activity duration in any duration format. Requires `durationUnit`, otherwise defaults to seconds
- `elevation` (String) Activity elevation in any distance format. Requires `elevationUnit`, otherwise defaults to metres
- `caption` (String) Title/caption for activity
- `description` (String) Description of an activity
- `startedAt` (Date/time) Timestamp for start of activity, ISO8601 format
- `unit` (String) Unit for distance, e.g.: meter, foot, step, yard, mile, km. Requires `distance`
- `durationUnit` (String) Unit for duration, e.g.: seconds, days, hours, minutes. Requires `duration`
- `elevationUnit` (String) Unit for elevation, e.g.: meter, foot, step, yard, mile, km. Requires `elevation`

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { createFitnessActivity } from 'supporticon/api/fitness-activities'

createFitnessActivity({
  token: 'xxxxx',
  type: 'walk',
  duration: '60'
})
```

## `deleteFitnessActivity`

Delete an existing fitness activity for an authenticated User.

**Params**

- `id` (String) Fitness activity ID _required_
- `page` (String) Page GUID _required_
- `token` (String) OAuth User Token _required_

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { updateFitnessActivity } from 'supporticon/api/fitness-activities'

deleteFitnessActivity({
  id: 'f440df6c-1101-4331-ac78-4fc5bc276f4e'
  page: '95c0c89f-468c-4a6e-84dd-08a75cbc96ca',
  token: 'xxxxx'
})
```
