# Goals

The aim of this library is to allow us to easily fetch and manage data from the various JG APIs.

## Available Parameters

Supporticon offers a consistent way to pass in parameters to your requests, to minimise the effect of the various small inconsistencies in naming and expected values of the different API endpoints.

Please note that not all endpoints accept all params, so refer to the API docs if you are unsure.

- `campaign` (String, Array)
  - a campaign GUID
  - an array of campaign GUIDs
- `charity` (String, Array, Object)
  - a charity id
  - an array of charity ids
- `event` (String, Object) an event id
- `type` (String) either `team` or `individual`
- `country` (String) two letter country code (e.g. `au`)
- `limit` (Integer) the number of results to fetch
- `page` (Integer) the page of results to fetch

# Table of contents

  * [Campaigns](/api/campaigns/)
  * [Donations](/api/donations/)
  * [Donation Totals](/api/donation-totals/)
  * [Feeds](/api/feeds/)
  * [Leaderboard](/api/leaderboard/)
  * [Pages](/api/pages/)
  * [Pages Totals](/api/pages-totals/)
  * [Posts](/api/posts/)
  * [Authentication](/api/authentication/)
