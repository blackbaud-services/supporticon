# Goal

Helpers related to fetching pages sorted by funds raised.

- [Configuration](#configuration)
- [fetchPages](#fetchpages)
- [fetchPagesAction](#fetchpagesaction)
- [pagesReducer](#pagesreducer)

## Configuration

- `namespace` - app/pages
- `endpoint` - api/v2/pages

## `fetchPages`

**Purpose**

Fetch supporter pages

**Params**

- `params` (Object) see [paramater list](../readme.md#availableparameters)

**Example**

```javascript
fetchPages({
  campaign: 'au-123'
})
```

See [details on fetch functions](../readme.md#1-fetchresource)

## `fetchPagesAction`

**Purpose**

Calls `fetchPages` and dispatches the relevant Redux actions.

**Params**

- `params` (Object) used to call `fetchPages`
- `options` (Object) configure the dispatched actions

**Example**

```javascript
dispatch(fetchPagesAction({
  campaign: 'au-123'
}))
```

See [details on action creators](../readme.md#2-fetchresourceaction)

## `pagesReducer`

**Purpose**

Creates a reducer that manages state involving pages requests.

**Params**

- `options` (Object) configure the reducer

**Example**

```javascript
combineReducers({
  pages: pagesReducer()
})
```

See [details on reducer creators](../readme.md#3-resourcereducer)
