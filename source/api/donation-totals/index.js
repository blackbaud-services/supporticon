import { get, isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/totals'
}

export const deserializeDonationTotals = (totals) => ({
  raised: totals.total_amount_cents.sum || 0,
  donations: totals.total_amount_cents.count
})

export const fetchDonationTotals = (params = required()) => {
  if (isJustGiving()) return Promise.reject('This method is not supported for JustGiving')

  return get(c.ENDPOINT, params)
}
