import { get } from '../../../utils/client'

export const fetchDonationFeed = (params) => {
  const finalParams = {
    ...params,
    type: 'OnlineDonation'
  }

  const mappings = {
    type: 'type'
  }

  return get('api/v2/search/feed', finalParams, { mappings })
    .then((response) => response.results)
}

export const deserializeDonation = (donation) => ({
  amount: donation.amount.cents,
  anonymous: donation.anonymous,
  createdAt: donation.created_at,
  message: donation.message,
  name: donation.nickname,
  page: donation.page_id,
  reply: donation.thankyou_message
})
