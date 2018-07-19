# Goals

The aim of this library is to allow us to easily fetch and manage data from the Supporter API.

## Available Parameters

Supporticon offers a consistent way to pass in parameters to your requests, to minimise the effect of the various small inconsistencies in naming and expected values of the different API endpoints.

Please note that not all endpoints accept all params, so refer to the API docs if you are unsure.

- `campaign` (String, Array)
  - a campaign id (EDH) or short name (JG)
  - an array of campaign ids (EDH)
- `charity` (String, Array, Object)
  - a charity id (EDH) or short name (JG)
  - an object containing both charity `uid` and `shortName`
  - an array of charity ids (EDH)
- `event` (String, Object) an event id (JG Only)
- `type` (String) either `team` or `individual` (EDH Only)
- `country` (String) two letter country code (e.g. `au`)
- `group` (String, Array) a group value, or an array of groups values (EDH Only)
- `limit` (Integer) the number of results to fetch
- `page` (Integer) the page of results to fetch
