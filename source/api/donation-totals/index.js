import client, { servicesAPI } from '../../utils/client'
import get from 'lodash/get'
import {
  getUID,
  required,
  dataSource,
  paramsSerializer
} from '../../utils/params'
import { fetchDonations } from '../feeds'
import { currencyCode } from '../../utils/currencies'
import { fetchTotals, deserializeTotals } from '../../utils/totals'

const fetchCampaignTotals = (id, currency) =>
  Promise.all([
    servicesAPI
      .get(`/v1/justgiving/campaigns/${id}`)
      .then(response => response.data.donationSummary),
    servicesAPI
      .get(`/v1/justgiving/campaigns/${id}/pages`, { params: { currency } })
      .then(response => response.data.meta.totalAmount)
  ]).then(
    ([
      {
        directDonationAmount,
        fundraiserRaisedAmount,
        offlineAmount,
        totalNumberOfDonations
      },
      totalAmount
    ]) => ({
      totalRaised:
        (totalAmount || fundraiserRaisedAmount) +
        directDonationAmount +
        offlineAmount,
      totalResults: totalNumberOfDonations
    })
  )

const fetchAllCampaignTotals = (campaignIds, currency) =>
  Promise.all(campaignIds.map(id => fetchCampaignTotals(id, currency))).then(
    campaigns =>
      campaigns.reduce(
        (acc, { totalRaised, totalResults }) => ({
          totalRaised: acc.totalRaised + totalRaised,
          totalResults: acc.totalResults + totalResults
        }),
        { totalRaised: 0, totalResults: 0 }
      )
  )

export const fetchDonationTotals = (params = required()) => {
  const campaignGuids = Array.isArray(params.campaign)
    ? params.campaign.map(getUID)
    : [getUID(params.campaign)]

  if (campaignGuids.length && params.tagId && params.tagValue) {
    return fetchTotals({
      segment: `page:campaign:${campaignGuids[0]}`,
      tagId: params.tagId,
      tagValue: params.tagValue
    }).then(totals => deserializeTotals(totals, currencyCode(params.country)))
  }

  switch (dataSource(params)) {
    case 'donationRef':
      return client.get(`/v1/donationtotal/ref/${params.donationRef}`, {
        currencyCode: currencyCode(params.country)
      })
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
        '/donationsleaderboards/v1/totals',
        {
          campaignGuids,
          charityIds: Array.isArray(params.charity)
            ? params.charity.map(getUID)
            : getUID(params.charity),
          currencyCode: currencyCode(params.country)
        },
        {},
        { paramsSerializer }
      )
    default:
      return params.includeOffline
        ? fetchAllCampaignTotals(
            campaignGuids,
            params.country && currencyCode(params.country)
          )
        : client.get(
          '/donationsleaderboards/v1/totals',
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
    totals.raised ||
    totals.totalRaised ||
    totals.raisedAmount ||
    totals.DonationsTotal ||
    get(totals, 'meta.totalAmount') ||
    get(totals, 'donationSummary.totalAmount') ||
    get(totals, 'totals.donationTotalAmount') ||
    0,
  offline: totals.offlineAmount || totals.raisedAmountOfflineInGBP || 0,
  donations:
    totals.donations ||
    totals.totalResults ||
    totals.numberOfDirectDonations ||
    totals.NumberOfDonations ||
    get(totals, 'donationSummary.totalNumberOfDonations') ||
    get(totals, 'totals.donationCount') ||
    0
})
