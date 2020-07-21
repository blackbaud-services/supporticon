import get from 'lodash/get'
import * as client from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
import { baseUrl, imageUrl } from '../../../utils/justgiving'

const fetchActivePages = pages => {
  const pageGuids = pages.map(page => page.ID).filter(Boolean)

  if (!pageGuids.length) {
    return pages
  }

  return client.servicesAPI
    .get('/v1/justgiving/proxy/fundraising/v2/pages/bulk', {
      params: { pageGuids: pageGuids.join(',') }
    })
    .then(response => response.data.results)
    .then(results => results.filter(page => page.status === 'Active'))
    .then(results => results.map(page => page.pageGuid))
    .then(activePageIds =>
      pages.filter(page => activePageIds.indexOf(page.ID) > -1)
    )
}

export const fetchFitnessLeaderboard = ({
  campaign = required(),
  activeOnly,
  activityType = 'any',
  limit = 10,
  sortBy = 'distance',
  type,
  useLegacy
}) => {
  if (useLegacy || type === 'teams') {
    return client
      .get(
        '/v1/fitness/campaign',
        { campaignGuid: campaign },
        {},
        { paramsSerializer }
      )
      .then(result => (type === 'team' ? result.teams : result.pages))
      .then(
        items =>
          activeOnly && type !== 'team' ? fetchActivePages(items) : items
      )
      .then(items => items.filter(item => item.Details))
      .then(items =>
        items.map(item => ({ ...item, type: type || 'individual' }))
      )
  }

  const query = `
    {
      leaderboard(
        id: "campaign_${activityType}_${sortBy}_${campaign}"
      ) {
        totals(limit: ${limit}) {
          tagValueAsNode {
            ... on Page {
              slug
              title
              summary
              status
              legacyId
              url
              owner {
                name
              }
              donationSummary {
                totalAmount {
                  value
                  currencyCode
                }
              }
              targetWithCurrency {
                value
                currencyCode
              }
              heroMedia {
                ... on ImageMedia {
                  url
                }
              }
            }
          }
          amounts {
            value
            unit
          }
        }
      }
    }
  `

  return client.servicesAPI
    .post('/v1/justgiving/graphql', { query })
    .then(response => response.data)
    .then(result => get(result, 'data.leaderboard.totals', []))
    .then(results => results.map(item => ({ ...item, ...item.tagValueAsNode })))
}

export const deserializeFitnessLeaderboard = (item, index) => ({
  charity: item.charity_name,
  distance: item.TotalValue || get(item, 'amounts[1].value'),
  id: item.ID || item.legacyId,
  image: get(item, 'heroMedia.url')
    ? `${get(item, 'heroMedia.url')}?template=Size186x186Crop`
    : null ||
      imageUrl(get(item, 'Details.ImageId'), 'Size186x186Crop') ||
      'https://assets.blackbaud-sites.com/images/supporticon/user.svg',
  name: get(item, 'Details.Name') || item.title,
  position: index + 1,
  raised: get(item, 'donationSummary.totalAmount.value', 0),
  slug: get(item, 'Details.Url') || item.slug,
  status: item.status,
  subtitle: get(item, 'owner.name'),
  url:
    item.url ||
    [
      baseUrl(),
      item.type === 'team' ? 'team' : 'fundraising',
      get(item, 'Details.Url')
    ].join('/')
})
