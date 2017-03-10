import fetch from '../../utils/fetch'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/totals',
  NAMESPACE: 'app/totals'
}

export const deserializeDonationTotals = (totals) => ({
  raised: totals.total_amount_cents.sum,
  donations: totals.total_amount_cents.count
})

export const fetchDonationTotals = (params = required()) => {
  return fetch(c.ENDPOINT, params)
}
