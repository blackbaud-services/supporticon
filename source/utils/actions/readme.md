# `createAction`

## Purpose

Fetch data from the supporter API and dispatch the relevant Redux actions.

## Params

- Options (Object) various configuration options to configure your action
  - fetcher (Promise: required) the actual fetch function e.g. fetchLeaderboard(), fetchPages() etc.
  - namespace (String: required) a unique namespace for dispatched actions e.g. `app/leaderboard`, `app/page`
  - actionDispatchers (Object) you can override action dispatchers if needed i.e. `fetch`, `fetchSuccess`, `fetchFailure`

## Returns

A thunk that will be dispatched by Redux Thunk middleware if installed

## Examples

```javascript
import { createAction } from 'supporticon/utils/actions'
import { fetchLeaderboard } from 'supporticon/api/leaderboard'

// ...

dispatch(createAction({
  namespace: 'app/leaderboard',
  fetcher: fetchLeaderboard({ campaign: 'au-123' })
}))
```

The above will call `fetchLeaderboard` with your supplied params to fetch your data, and will dispatch the following actions.

- `app/leaderboard/FETCH` when the request to Supporter is made
  - `payload` - empty
- `app/leaderboard/FETCH_SUCCESS` when the response is received, with the pay
  - `payload.data` - the result(s) retrieved from Supporter
- `app/leaderboard/FETCH_FAILURE` when an error is encountered
  - `payload.error` - the error encountered
