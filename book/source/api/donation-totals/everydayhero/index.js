import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchDonationTotals = (params = required()) => {
  const mappings = {
    type: 'type'
  }

  return get('api/v2/search/totals', params, { mappings })
}

export const deserializeDonationTotals = (totals) => ({
  raised: totals.total_amount_cents.sum / 100 || 0,
  donations: totals.total_amount_cents.count
})
