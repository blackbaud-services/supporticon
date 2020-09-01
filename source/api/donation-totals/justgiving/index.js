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

const fetchCampaignTotals = id =>
  Promise.all([
    servicesAPI
      .get(`/v1/justgiving/campaigns/${id}`)
      .then(response => response.data.donationSummary),
    servicesAPI
      .get(`/v1/justgiving/campaigns/${id}/pages`)
      .then(response => response.data.meta.totalAmount)
  ]).then(([{ offlineAmount, totalNumberOfDonations }, totalAmount]) => ({
    totalRaised: totalAmount + offlineAmount,
    totalResults: totalNumberOfDonations
  }))

const fetchAllCampaignTotals = campaignIds =>
  Promise.all(campaignIds.map(fetchCampaignTotals)).then(campaigns =>
    campaigns.reduce(
      (acc, { totalRaised, totalResults }) => ({
        totalRaised: acc.totalRaised + totalRaised,
        totalResults: acc.totalResults + totalResults
      }),
      { totalRaised: 0, totalResults: 0 }
    )
  )

export const fetchDonationTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return Promise.all([
        fetchDonations(params),
        client.get(
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
      ]).then(([feed, totals]) => ({
        ...feed.meta,
        ...totals
      }))
    case 'charity':
      return client.get(
        'donationsleaderboards/v1/totals',
        {
          charityIds: Array.isArray(params.charity)
            ? params.charity.map(getUID)
            : getUID(params.charity),
          currencyCode: currencyCode(params.country)
        },
        {},
        { paramsSerializer }
      )
    default:
      const campaignGuids = Array.isArray(params.campaign)
        ? params.campaign.map(getUID)
        : [getUID(params.campaign)]

      return params.includeOffline
        ? fetchAllCampaignTotals(campaignGuids)
        : client.get(
          'donationsleaderboards/v1/totals',
          {
            campaignGuids,
            currencyCode: currencyCode(params.country)
          },
          {},
          { paramsSerializer }
        )
  }
}

export const deserializeDonationTotals = totals => ({
  raised:
    totals.totalRaised ||
    totals.raisedAmount ||
    get(totals, 'meta.totalAmount') ||
    get(totals, 'donationSummary.totalAmount') ||
    get(totals, 'totals.donationTotalAmount') ||
    0,
  offline: totals.offlineAmount || totals.raisedAmountOfflineInGBP || 0,
  donations:
    totals.totalResults ||
    totals.numberOfDirectDonations ||
    get(totals, 'donationSummary.totalNumberOfDonations') ||
    get(totals, 'totals.donationCount') ||
    0
})
