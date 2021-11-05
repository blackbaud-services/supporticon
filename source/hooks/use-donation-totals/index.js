import { useQuery } from 'react-query'
import pickBy from 'lodash/pickBy'
import {
  fetchDonationTotals,
  deserializeDonationTotals
} from '../../api/donation-totals'

export const useDonationTotals = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options

  return useQuery(
    ['donationTotals', pickBy(params)],
    () => fetchDonationTotals(params).then(deserializeDonationTotals),
    {
      refetchInterval,
      staleTime
    }
  )
}

export default useDonationTotals
