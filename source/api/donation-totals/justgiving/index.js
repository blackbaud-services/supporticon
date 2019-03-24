import client from '../../../utils/client'
import get from 'lodash/get'
import { getUID, required, dataSource } from '../../../utils/params'
import { currencyCode } from '../../../utils/currencies'

export const fetchDonationTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return client.get(`v1/event/${getUID(params.event)}/leaderboard`, {
        currency: currencyCode(params.country)
      })
    case 'charity':
      // No API method supports total funds raised for a charity
      return required()
    default:
      return client.get(`campaigns/v2/campaign/${getUID(params.campaign)}`)
  }
}

export const deserializeDonationTotals = totals => ({
  raised:
    totals.totalRaised ||
    totals.raisedAmount ||
    get(totals, 'donationSummary.totalAmount') ||
    0,
  donations:
    totals.numberOfDirectDonations ||
    get(totals, 'donationSummary.totalNumberOfDonations') ||
    0
})
