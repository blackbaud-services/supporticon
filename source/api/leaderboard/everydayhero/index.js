import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

/**
* @function fetches supporter pages ranked by funds raised
*/
export const fetchLeaderboard = (params = required()) => {
  const transforms = {
    type: (val) => val === 'team' ? 'teams' : 'individuals'
  }

  return get('api/v2/search/pages_totals', params, { transforms })
    .then((response) => response.results)
}

/**
* @function a default deserializer for leaderboard pages
*/
export const deserializeLeaderboard = ({ page, team }, index) => {
  const detail = team || page

  return {
    position: index + 1,
    id: detail.id,
    name: detail.name,
    charity: detail.charity_name,
    url: detail.url,
    image: detail.image.medium_image_url,
    raised: detail.amount.cents / 100,
    target: page.target_cents / 100,
    currency: page.amount.currency.iso_code,
    currencySymbol: page.amount.currency.symbol,
    groups: detail.group_values
  }
}
