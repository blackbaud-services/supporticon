import fetch from '../../utils/fetch'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/pages_totals',
  NAMESPACE: 'app/leaderboard'
}

/**
* @function fetches supporter pages ranked by funds raised
*/
export const fetchLeaderboard = (params = required()) => {
  const transforms = {
    type: (val) => val === 'team' ? 'teams' : 'individuals'
  }

  return fetch(c.ENDPOINT, params, { transforms })
    .then((response) => response.results)
}

/**
* @function a default deserializer for leaderboard pages
*/
export const deserializeLeaderboard = ({ page, team }, index) => {
  const detail = team || page
  return {
    position: index++,
    id: detail.id,
    name: detail.name,
    charity: detail.charity_name,
    url: detail.url,
    image: detail.image.medium_image_url,
    raised: detail.amount.cents,
    groups: detail.group_values
  }
}
