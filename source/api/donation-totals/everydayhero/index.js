import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchDonationTotals = (params = required()) => {
  return get('api/v2/search/totals', params)
}

export const deserializeDonationTotals = (totals) => ({
  raised: totals.total_amount_cents.sum / 100 || 0,
  donations: totals.total_amount_cents.count
})
