# Goal

Helpers related to fetching & creating fitness activities

- [fetchFitnessActivities](#fetchFitnessActivities)
- [createFitnessActivity](#createFitnessActivity)

## `fetchFitnessActivities`

Fetches fitness activities

See [the API documentation](http://developer.everydayhero.com/fitness-activities/#retreive-a-list-of-fitness-activities) for more information.

**Params**

- `pageId` (string or array)
- `teamId` (string)
- `teamUid` (string)
- `teamPageId` (string)
- `startAt` (string/date-time)
- `endAt` (string/date-time)
- `type` (string)
- `includeManual` (boolean)
- `excludeVirtual` (boolean)
- `excludeNonVirtual` (boolean)

**Returns**

A pending promise that will either resolve to:

- Success: the matching fitness activities
- Failure: the error

**Example**

```javascript
import { fetchFitnessActivities } from 'supporticon/api/fitness-activities'

fetchFitnessActivities({ campaign: 'au-0' })
```


## `createFitnessActivity`

Create a fitness activity for an authenticated User, optionally for a page.

See [the API documentation](http://developer.everydayhero.com/fitness-activities#createupdate-fitness-activity) for more information.

**Params**

- `token` (String) OAuth User Token _required_
- `type` (String) Activity type _required_
- `duration` (String) Activity duration in seconds _required_
- `calories` (Integer) kcals total burned per activity, e.g. ~600 for a 10km run
- `caption` (String) Title/caption for activity
- `coordinates` (Array) To be used to render a map, if provided. Array of lat/longs
- `description` (String) Description of an activity
- `distance` (Integer) Distance covered in any distance format. Requires `unit`
- `distanceInMeters` (Integer) Distance covered for activity in meters
- `elevationSeries` (Array) Array of elevation points (in meters)
- `manual` (Boolean) Manually logged activity, default is `true`
- `pageId` (String) Fundraising page to attribute the activity to
- `startedAt` (Date/time) Timestamp for start of activity, ISO8601 format
- `trainer` (Boolean)
- `uid` (String) Unique uuid reference for activity
- `unit` (String) Unit for distance, e.g.: meter, foot, step, yard, mile, km. Requires `distance`
- `virtual` (Boolean)
- `visible` (Boolean) Must be true for the fitness activity to be visible

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

**Example**

```javascript
import { createFitnessActivity } from 'supporticon/api/fitness-activities'

createFitnessActivity({
  token: 'xxxxx',
  type: 'sport',
  duration: '60'
})
```
