import { get } from '../../../utils/client'
import { required, dataSource } from '../../../utils/params'

export const fetchDonationTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return get(`v1/event/${params.event}/leaderboard`)
    case 'charity':
      // No API method supports total funds raised for a charity
      return required()
    default:
      return get(`v1/campaigns/${params.charity}/${params.campaign}`)
  }
}

export const deserializeDonationTotals = (totals) => ({
  raised: totals.totalRaised || totals.raisedAmount || 0,
  donations: totals.numberOfDirectDonations || 0
})
