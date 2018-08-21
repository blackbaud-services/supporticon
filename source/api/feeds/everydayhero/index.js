import { get } from '../../../utils/client'

export const fetchDonationFeed = (params) => {
  const finalParams = {
    ...params,
    type: 'OnlineDonation'
  }

  const mappings = {
    campaign: 'campaign_id',
    charity: 'charity_id',
    page: 'page_id',
    team: 'team_id',
    type: 'type'
  }

  return get('api/v2/search/feed', finalParams, { mappings })
    .then((response) => response.results)
}

export const deserializeDonation = (donation) => ({
  amount: donation.amount.cents / 100,
  anonymous: donation.anonymous,
  createdAt: donation.created_at,
  currency: donation.amount.currency.iso_code,
  message: donation.message,
  name: donation.nickname,
  page: donation.page_id,
  reply: donation.thankyou_message
})
