import { get } from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/fitness_activities_totals'
}

/**
* @function fetches supporter pages ranked by fitness activities
*/
export const fetchFitnessLeaderboard = (params = required()) => {
  const transforms = {
    type: (val) => val === 'team' ? 'teams' : 'pages'
  }

  const mappings = {
    activity: 'type',
    type: 'group_by'
  }

  return get(c.ENDPOINT, params, { mappings, transforms })
    .then((response) => response.results)
}

/**
* @function a default deserializer for leaderboard pages
*/
export const deserializeFitnessLeaderboard = ({ page, team, distance_in_meters }, index) => {
  const detail = team || page
  return {
    position: index++,
    id: detail.id,
    name: detail.name,
    charity: detail.charity_name,
    url: detail.url,
    image: detail.image.medium_image_url,
    distance: distance_in_meters,
    raised: detail.amount.cents,
    groups: detail.group_values
  }
}
