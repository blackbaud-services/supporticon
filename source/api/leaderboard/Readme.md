# Goal

Helpers related to fetching pages sorted by funds raised.

- [Configuration](#configuration)
- [fetchLeaderboard](#fetchleaderboard)
- [fetchLeaderboardAction](#fetchleaderboardaction)
- [leaderboardReducer](#leaderboardreducer)

## Configuration

- `namespace` - app/leaderboard
- `endpoint` - api/v2/search/pages_totals

## `fetchLeaderboard`

**Purpose**

Fetch pages from Supporter sorted by funds raised.

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Example**

```javascript
fetchLeaderboard({
  campaign: 'au-123'
})
```

See [details on fetch functions](../readme.md#1-fetchresource)

## `fetchLeaderboardAction`

**Purpose**

Calls `fetchLeaderboard` and dispatches the relevant Redux actions.

**Params**

- `params` (Object) used to call `fetchLeaderboard`
- `options` (Object) configure the dispatched actions

**Example**

```javascript
dispatch(fetchLeaderboardAction({
  campaign: 'au-123'
}))
```

See [details on action creators](../readme.md#2-fetchresourceaction)

## `leaderboardReducer`

**Purpose**

Creates a reducer that manages state involving leaderboard requests.

**Params**

- `options` (Object) configure the reducer

**Example**

```javascript
combineReducers({
  leaderboard: leaderboardReducer()
})
```

See [details on reducer creators](../readme.md#3-resourcereducer)
