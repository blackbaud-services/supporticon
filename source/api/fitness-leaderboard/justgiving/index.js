import get from 'lodash/get'
import { fetchPages } from '../../pages'
import * as client from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
import { baseUrl, imageUrl } from '../../../utils/justgiving'

const fetchActivePages = pages => {
  const pageGuids = pages.map(page => page.ID).filter(Boolean)

  if (!pageGuids.length) {
    return pages
  }

  return fetchPages({ ids: pageGuids, allPages: true })
    .then(results => results.map(page => page.pageGuid))
    .then(activePageIds =>
      pages.filter(page => activePageIds.indexOf(page.ID) > -1)
    )
}

export const fetchFitnessLeaderboard = ({
  campaign = required(),
  activeOnly,
  activityType = 'any',
  endDate,
  limit = 10,
  offset,
  sortBy = 'distance',
  startDate,
  type,
  useLegacy = true
}) => {
  if (useLegacy || type === 'teams') {
    const params = {
      campaignGuid: campaign,
      limit: 100,
      offset: offset || 0,
      start: startDate,
      end: endDate
    }

    return client
      .get('/v1/fitness/campaign', params, {}, { paramsSerializer })
      .then(result => (type === 'team' ? result.teams : result.pages))
      .then(items => items.slice(0, limit || 100))
      .then(
        items => (activeOnly && type !== 'team' ? fetchActivePages(items) : items)
      )
      .then(items => items.filter(item => item.Details))
      .then(items => items.map(item => ({ ...item, type: type || 'individual' })))
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
