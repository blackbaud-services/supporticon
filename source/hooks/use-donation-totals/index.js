import { useQuery } from 'react-query'
import pickBy from 'lodash/pickBy'
import {
  fetchDonationTotals,
  deserializeDonationTotals
} from '../../api/donation-totals'

export const useDonationTotals = (params, options = {}) =>
  useQuery(
    ['donationTotals', pickBy(params)],
    () => fetchDonationTotals(params).then(deserializeDonationTotals),
    options
  )

export default useDonationTotals
