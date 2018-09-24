import { get } from '../../../utils/client'
import {
  getShortName,
  getUID,
  required,
  dataSource
} from '../../../utils/params'
import { currencyCode } from '../../../utils/currencies'

export const fetchDonationTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return get(`v1/event/${getUID(params.event)}/leaderboard`, {
        currency: currencyCode(params.country)
      })
    case 'charity':
      // No API method supports total funds raised for a charity
      return required()
    default:
      return get(
        `v1/campaigns/${getShortName(params.charity)}/${getShortName(
          params.campaign
        )}`
      )
  }
}

export const deserializeDonationTotals = totals => ({
  raised: totals.totalRaised || totals.raisedAmount || 0,
  donations: totals.numberOfDirectDonations || 0
})
