import client from '../../../utils/client'
import get from 'lodash/get'
import { fetchCampaign } from '../../campaigns'
import {
  getUID,
  required,
  dataSource,
  paramsSerializer
} from '../../../utils/params'
import { currencyCode } from '../../../utils/currencies'

export const fetchDonationTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return client.get(
        '/v1/events/leaderboard',
        {
          eventid: Array.isArray(params.event)
            ? params.event.map(getUID)
            : getUID(params.event),
          currency: currencyCode(params.country)
        },
        {},
        { paramsSerializer }
      )
    case 'charity':
      // No API method supports total funds raised for a charity
      return required()
    default:
      return fetchCampaign(getUID(params.campaign))
  }
}

export const deserializeDonationTotals = totals => ({
  raised: totals.raisedAmountOfflineInGBP
    ? totals.totalRaised + totals.raisedAmountOfflineInGBP
    : totals.totalRaised ||
      totals.raisedAmount ||
      get(totals, 'donationSummary.totalAmount') ||
      0,
  donations:
    totals.numberOfDirectDonations ||
    get(totals, 'donationSummary.totalNumberOfDonations') ||
    0
})
