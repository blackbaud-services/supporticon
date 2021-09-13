import { get, servicesAPI } from '../../utils/client'
import {
  getUID,
  required,
  dataSource,
  paramsSerializer,
  splitOnDelimiter
} from '../../utils/params'
import { currencyCode } from '../../utils/currencies'

const fetchEvent = id =>
  get(`/v1/event/${id}/pages`).then(response => response.totalFundraisingPages)

const fetchCampaign = id =>
  servicesAPI
    .get(`/v1/justgiving/campaigns/${id}/leaderboard`)
    .then(({ data }) => data.meta.totalResults)

const fetchCampaignTeams = id =>
  servicesAPI
    .get('/v1/justgiving/proxy/campaigns/v1/teams/search', {
      params: { CampaignGuid: id },
      paramsSerializer
    })
    .then(response => response.data.totalResults)

export const fetchPagesTotals = (params = required()) => {
  const eventIds = Array.isArray(params.event)
    ? params.event
    : [params.event]

  switch (dataSource(params)) {
    case 'event':
      return Promise.all(eventIds.map(getUID).map(fetchEvent)).then(events =>
        events.reduce((acc, total) => acc + total, 0)
      )
    case 'campaign':
      if (params.type === 'team') {
        const campaignIds = Array.isArray(params.campaign)
          ? params.campaign
          : [params.campaign]

        return Promise.all(
          campaignIds.map(getUID).map(fetchCampaignTeams)
        ).then(campaigns => campaigns.reduce((acc, total) => acc + total, 0))
      } else {
        const campaignIds = Array.isArray(params.campaign)
          ? params.campaign
          : [params.campaign]

        return Promise.all(campaignIds.map(getUID).map(fetchCampaign)).then(
          campaigns => campaigns.reduce((acc, total) => acc + total, 0)
        )
      }
    default:
      return get(
        '/donationsleaderboards/v1/leaderboard',
        {
          ...params,
          currencyCode: currencyCode(params.country)
        },
        {
          mappings: {
            campaign: 'campaignGuids',
            charity: 'charityIds',
            page: 'pageGuids',
            excludePageIds: 'excludePageGuids',
            limit: 'take'
          },
          transforms: {
            campaign: splitOnDelimiter,
            charity: splitOnDelimiter,
            excludePageIds: splitOnDelimiter
          }
        },
        { paramsSerializer }
      ).then(data => data.totalResults)
  }
}
