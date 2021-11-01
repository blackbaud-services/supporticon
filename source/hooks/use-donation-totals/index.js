import { useQuery } from 'react-query'
import {
  fetchDonationTotals,
  deserializeDonationTotals
} from '../../api/donation-totals'

export const useDonationTotals = (params, options = {}) =>
  useQuery(
    ['donationTotals', params],
    () => fetchDonationTotals(params).then(deserializeDonationTotals),
    options
  )

export default useDonationTotals
