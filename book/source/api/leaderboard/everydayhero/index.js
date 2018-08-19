import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

/**
* @function fetches supporter pages ranked by funds raised
*/
export const fetchLeaderboard = (params = required()) => {
  const transforms = {
    type: (val) => val === 'team'
      ? 'teams'
      : val === 'group'
        ? 'groups'
        : 'individuals'
  }

  const mappings = {
    endDate: 'end_at',
    excludePageIds: 'exclude_page_ids',
    groupID: 'group_id',
    maxAmount: 'max_amount_cents',
    minAmount: 'min_amount_cents'
  }

  return get('api/v2/search/pages_totals', params, { mappings, transforms })
    .then((response) => response.results)
}

/**
* @function a default deserializer for leaderboard pages
*/
export const deserializeLeaderboard = (result, index) => {
  if (result.page) {
    return deserializePage(result.page, index)
  } else if (result.team) {
    return deserializePage(result.team, index)
  } else if (result.group) {
    return deserializeGroup(result, index)
  }
}

const deserializePage = (item, index) => ({
  position: index + 1,
  id: item.id,
  name: item.name,
  subtitle: item.charity_name,
  url: item.url,
  image: item.image.large_image_url,
  raised: item.amount.cents / 100,
  target: item.target_cents / 100,
  offline: (item.offline_amount_cents || 0) / 100,
  currency: item.amount.currency.iso_code,
  currencySymbol: item.amount.currency.symbol,
  groups: item.group_values
})

const deserializeGroup = (item, index) => ({
  position: index + 1,
  count: item.count,
  id: item.group.id,
  name: item.group.value,
  raised: item.amount_cents / 100
})
