import pickBy from 'lodash/pickBy'
import { useQuery } from 'react-query'
import { fetchDonationFeed, deserializeDonation } from '../../api/feeds'

export const useDonationFeed = (params, options = {}) =>
  useQuery(
    ['donationFeed', pickBy(params)],
    () => fetchDonationFeed(params).then(data => data.map(deserializeDonation)),
    options
  )

export default useDonationFeed
