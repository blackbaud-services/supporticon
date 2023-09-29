import { get, servicesAPI } from '../../utils/client'
import {
  getUID,
  required,
  dataSource,
  paramsSerializer,
  splitOnDelimiter
} from '../../utils/params'
import { currencyCode } from '../../utils/currencies'
import { fetchPagesByTag } from '../pages'
import lodashGet from 'lodash/get'
import lodashSum from 'lodash/sum'

const fetchEvent = id =>
  get(`/v1/event/${id}/pages`).then(response => response.totalFundraisingPages)

const fetchCampaign = ({ campaign, after, limit, runningCount }) => {
  const query = `
  query getTotalsWithLeaderboard($id: ID, $after: String, $limit: Int!) {
    page(type: ONE_PAGE, id: $id) {
        leaderboard(type: FUNDRAISERS, after: $after, first: $limit) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `

  return servicesAPI
    .post('/v1/justgiving/graphql', {
      query,
      variables: { id: campaign, after, limit }
    })
    .then(response => response.data)
    .then(result => {
      const supporterCount = lodashGet(
        result,
        'data.page.leaderboard.edges',
        []
      )
      const pageInfo = lodashGet(
        result,
        'data.page.leaderboard.pageInfo',
        undefined
      )
      return {
        totalCount: supporterCount?.length || 0 + runningCount,
        pageInfo
      }
    })
}

const recursivelyFetchCampaign = ({
  campaign,
  limit = 10,
  after,
  runningCount = 0
}) => {
  return fetchCampaign({ campaign, limit, after, runningCount }).then(data => {
    const { hasNextPage, endCursor } = data.pageInfo
    if (hasNextPage) {
      return recursivelyFetchCampaign({
        campaign,
        limit,
        after: endCursor,
        runningCount: data.totalCount
      })
    } else {
      return data.totalCount
    }
  })
}

const fetchCampaignTeams = id =>
  servicesAPI
    .get('/v1/justgiving/proxy/campaigns/v1/teams/search', {
      params: { CampaignGuid: id },
      paramsSerializer
    })
    .then(response => response.data.totalResults)

export const fetchPagesTotals = (params = required()) => {
  if (params.tagId && params.tagValue) {
    return fetchPagesByTag(params).then(res => res.numberOfHits)
  }

  const eventIds = Array.isArray(params.event) ? params.event : [params.event]

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

        return Promise.all(
          campaignIds.map(id =>
            recursivelyFetchCampaign({ campaign: getUID(id) })
          )
        ).then(total => lodashSum(total))
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
