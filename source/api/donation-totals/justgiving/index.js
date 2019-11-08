import client, { servicesAPI } from '../../../utils/client'
import get from 'lodash/get'
import {
  getUID,
  required,
  dataSource,
  paramsSerializer
} from '../../../utils/params'
import { fetchDonations } from '../../feeds/justgiving'
import { currencyCode } from '../../../utils/currencies'

export const fetchDonationTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      const requestParams = {
        eventid: Array.isArray(params.event)
          ? params.event.map(getUID)
          : getUID(params.event),
        currency: currencyCode(params.country)
      }

      return Promise.all([
        fetchDonations(params),
        client.get(
          '/v1/events/leaderboard',
          requestParams,
          {},
          { paramsSerializer }
        )
      ]).then(([feed, totals]) => ({
        ...feed.meta,
        ...totals
      }))
    case 'charity':
      // No API method supports total funds raised for a charity
      return required()
    default:
      return servicesAPI
        .get(`/v1/justgiving/campaigns/${getUID(params.campaign)}`)
        .then(response => response.data)
  }
}

export const deserializeDonationTotals = totals => ({
  raised:
    totals.currency === 'GBP'
      ? totals.raisedAmountOfflineInGBP + totals.raisedAmount
      : totals.totalRaised ||
        totals.raisedAmount ||
        get(totals, 'meta.totalAmount') ||
        get(totals, 'donationSummary.totalAmount') ||
        0,
  offline: totals.offlineAmount || 0,
  donations:
    totals.totalResults ||
    totals.numberOfDirectDonations ||
    get(totals, 'donationSummary.totalNumberOfDonations') ||
    0
})
