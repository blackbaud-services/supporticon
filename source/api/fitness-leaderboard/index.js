import { get, isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/fitness_activities_totals'
}

/**
* @function fetches supporter pages ranked by fitness activities
*/
export const fetchFitnessLeaderboard = (params = required()) => {
  if (isJustGiving()) return Promise.reject('This method is not supported for JustGiving')

  const transforms = {
    type: (val) => val === 'team'
      ? 'teams'
      : val === 'group'
        ? 'groups'
        : 'individuals'
  }

  const mappings = {
    activity: 'type',
    groupID: 'group_id',
    type: 'group_by'
  }

  return get(c.ENDPOINT, params, { mappings, transforms })
    .then((response) => response.results)
}

/**
* @function a default deserializer for leaderboard pages
*/
export const deserializeFitnessLeaderboard = (result, index) => {
  if (result.page) {
    return deserializePage(result.page, result.distance_in_meters, index)
  } else if (result.team) {
    return deserializePage(result.team, result.distance_in_meters, index)
  } else if (result.group) {
    return deserializeGroup(result, index)
  }
}

const deserializePage = (item, distance, index) => ({
  position: index + 1,
  id: item.id,
  name: item.name,
  charity: item.charity_name,
  url: item.url,
  image: item.image.medium_image_url,
  raised: item.amount.cents,
  groups: item.group_values,
  distance
})

const deserializeGroup = (item, index) => ({
  position: index + 1,
  count: item.count,
  id: item.group.id,
  name: item.group.value,
  raised: item.amount_cents / 100,
  distance: item.distance_in_meters
})
