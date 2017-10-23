import { get } from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/totals',
  NAMESPACE: 'app/totals'
}

export const deserializeDonationTotals = (totals) => ({
  raised: totals.total_amount_cents.sum || 0,
  donations: totals.total_amount_cents.count
})

export const fetchDonationTotals = (params = required()) => {
  return get(c.ENDPOINT, params)
}
