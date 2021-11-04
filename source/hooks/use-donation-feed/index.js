import { useQuery } from 'react-query'
import { fetchDonationFeed, deserializeDonation } from '../../api/feeds'

export const useDonationFeed = (params, options = {}) =>
  useQuery(
    ['donationFeed', params],
    () => fetchDonationFeed(params).then(data => data.map(deserializeDonation)),
    options
  )

export default useDonationFeed
