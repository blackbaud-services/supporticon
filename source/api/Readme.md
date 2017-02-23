# Goals

The aim of this library is to allow us to easily fetch and manage data from the Supporter API.

## Available Parameters

Supporticon offers a consistent way to pass in parameters to your requests, to minimise the effect of the various small inconsistencies in naming and expected values of the different API endpoints.

Please note that not all endpoints accept all params, so refer to the API docs if you are unsure.

- `campaign` (String, Array) a campaign id, or an array of campaign ids
- `charity` (String, Array) a charity id, or an array of charity ids
- `type` (String) either `team` or `individual`
- `group` (String, Array) a group value, or an array of groups values
- `limit` (Integer) the number of results to fetch
- `page` (Integer) the page of results to fetch

## Helpers

There are 4 primary types of helpers used throughout the library.

1. [fetch{Resource}](#1-fetchresource)
2. [fetch{Resource}Action](#2-fetchresourceaction)
3. [{resource}Reducer](#3-resourcereducer)

### 1. `fetch{Resource}`

**Purpose**

Request data from the Supporter API

**Params**

- `params` (Object) takes an object containing the parameters to include in the request e.g. campaign, charity, limit

**Returns**

A pending promise that will either resolve to:

- Success: the data returned from the request
- Failure: the error encountered

### 2. `fetch{Resource}Action`

**Purpose**

Fetch data from the supporter API and dispatch the relevant Redux actions.

- `app/{resource}/FETCH` - payload {}
- `app/{resource}/FETCH_SUCCESS` - payload { data }
- `app/{resource}/FETCH_FAILURE` - payload { error }

**Params**

- `params` (Object) takes an object containing the parameters to include in the request e.g. campaign, charity, limit
- `options` (Object) options related to the Redux actions that will be fired, that can be overridden if needed
  - `namespace` (String) will determine the action types e.g. `app/campaign/FETCH`
  - `fetch` (Function) will be the function called to dispatch the `FETCH` action
  - `fetchSuccess` (Function) will be the function called to dispatch the `FETCH_SUCCESS` action
  - `fetchFailure` (Function) will be the function called to dispatch the `FETCH_FAILURE` action

**Returns**

Returns a thunk that will be dispatched by Redux Thunk middleware if installed.

### 3. `{resource}Reducer`

**Purpose**

Creates a simple reducer that listens to the related Redux actions and stores the state of the requests.

These functions are made to work nicely with their related `fetch{Resource}Action` functions.

**Params**

- `options` (Object) configurable and overridable options to set up your reducer.
  - `namespace` (String) will determine the action types to respond to e.g. `app/campaign/FETCH`
  - `initialState` (Object) if you would like to configure the initial state of your reducer
  - `handlers` (Object) can contain fetch, fetchSuccess, fetchFailure handlers
  - `deserialize` (Function) pass in a function to deserialize returned data in the `FETCH_SUCCESS` handler

**Returns**

A reducer function that takes 2 parameters, the state and a dispatched action.
