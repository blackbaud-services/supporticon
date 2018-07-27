import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchDonationTotals = (params = required()) => {
  const mappings = {
    type: 'type'
  }

  return get('api/v2/search/totals', params, { mappings })
}

export const deserializeDonationTotals = (totals, excludeOffline) => {
  const offsetOffline = excludeOffline && totals.types.offline_donation
  const raisedOffset = offsetOffline ? totals.types.offline_donation.total_amount_cents.sum : 0
  const countOffset = offsetOffline ? totals.types.offline_donation.total_amount_cents.count : 0

  return {
    raised: totals.total_amount_cents.sum - raisedOffset / 100 || 0,
    donations: totals.total_amount_cents.count - countOffset || 0
  }
}
