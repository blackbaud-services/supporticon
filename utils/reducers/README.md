# `createReducer`

## Purpose

Creates a simple reducer that listens to the related Redux actions and stores the state of the requests.

## Params

- Options (Object) various configuration options to configure your reduce
  - namespace (String: required) the namespace to listen to for the relevant actions e.g. `app/leaderboard`
  - deserialize (Function) the function to deserialize the response payload if required e.g. `deserializeLeaderboard`
  - initialState (Object) the initial state of the reducer (default: {})
  - handlers (Object) you can override handlers if needed i.e. `fetch`, `fetchSuccess`, `fetchFailure`

## Returns

A valid reducer that can be easily added to `combineReducers`

## Examples

```javascript
import { createReducer } from 'supporticon/utils/reducers'
import { deserializeLeaderboard } from 'supporticon/api/leaderboard'

// ...

combineReducers({
  leaderboard: createReducer({
    namespace: 'app/leaderboard',
    deserialize: deserializeLeaderboard
  })
})
```

Using the default handlers, the following will respond to the following actions.

- `app/leaderboard/FETCH` - { status: 'fetching' }
- `app/leaderboard/FETCH_SUCCESS` - { status: 'fetched', data: deserializedResponse }
- `app/leaderboard/FETCH_FAILURE` - { status: 'failed' }
