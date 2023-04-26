import flatten from 'lodash/flatten'
import lodashGet from 'lodash/get'
import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import { get, servicesAPI } from '../../utils/client'
import { apiImageUrl, baseUrl, imageUrl } from '../../utils/justgiving'
import {
  getUID,
  required,
  dataSource,
  isEmpty,
  paramsSerializer,
  splitOnDelimiter
} from '../../utils/params'
import { currencySymbol, currencyCode } from '../../utils/currencies'
import { fetchLeaderboard as getGraphQLeaderboard } from '../../utils/leaderboards'
import { getMonetaryValue } from '../../utils/totals'

/**
 * @function fetches fundraising pages ranked by funds raised
 */
export const fetchLeaderboard = (params = required()) => {
  console.log('params', params)
  if (
    !isEmpty(params.campaign) &&
    (params.allPages || params.q) &&
    params.type !== 'team'
  ) {
    return recursivelyFetchJGLeaderboard(
      Array.isArray(params.campaign)
        ? params.campaign.map(getUID).join(',')
        : getUID(params.campaign),
      params.q,
      params.q ? 10 : params.limit
    ).then(results => removeExcludedPages(results, params.excludePageIds))
  }

  if (params.tagId || params.tagValue || params.sortBy) {
    return getGraphQLeaderboard({
      ...params,
      id: Array.isArray(params.campaign)
        ? params.campaign.map(getUID).join(',')
        : getUID(params.campaign),
      type: 'campaign'
    })
      .then(results => removeExcludedPages(results, params.excludePageIds))
      .then(results =>
        results.filter(item => lodashGet(item, 'amounts[0].value', 0) > 0)
      )
  }

  if (dataSource(params) === 'event') {
    return fetchEventLeaderboard(params)
  }

  return Promise.all([
    !isEmpty(params.campaign) && isEmpty(params.charity)
    ? fetchCampaignGraphqlLeaderboard(params)
    : Promise.resolve([]),
    fetchLegacyLeaderboard(params)
  ])
    .then(flatten)
    .then(items =>
      items.map(original => ({
        original,
        deserialized: deserializeLeaderboard(original)
      }))
    )
    .then(items => orderBy(items, ['deserialized.raised'], ['desc']))
    .then(items => uniqBy(items, 'deserialized.id'))
    .then(items => items.map(item => item.original))
    .then(results => removeExcludedPages(results, params.excludePageIds))
}

export const fetchEventLeaderboard = params => {
  if (params.type === 'team') {
    return Promise.reject(
      new Error('Team leaderboards by event are not supported')
    )
  }

  const args = {
    eventid: Array.isArray(params.event)
      ? params.event.map(getUID)
      : getUID(params.event),
    currency: currencyCode(params.country),
    maxResults: params.limit
  }

  if (params.charity) {
    args.charityIds = params.charity
  }

  return get(
    '/v1/events/leaderboard',
    args,
    {},
    { paramsSerializer }
  )
    .then(response =>
      response.pages.map(page => ({
        ...page,
        raisedAmount: page.amount,
        eventName: response.eventName,
        currencyCode: response.currency,
        currencySymbol: currencySymbol(response.currency)
      }))
    )
    .then(results => removeExcludedPages(results, params.excludePageIds))
}

export const fetchCampaignGraphqlLeaderboard = params => {
  const query = `
    query($id: ID!, $limit: Int!, $type: PageLeaderboardType!,) {
      page(type: ONE_PAGE, id: $id) {
        leaderboard (first: $limit, type: $type) {
          nodes {
            createDate
            legacyId
            slug
            status
            title
            cover {
              ... on ImageMedia { url }
            }
            donationSummary {
              totalAmount { value currencyCode }
              onlineAmount { value currencyCode }
              offlineAmount { value currencyCode }
              donationCount
            }
            owner {
              legacyId
              name
              avatar
            }
            targetWithCurrency {
              value
              currencyCode
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  `

  return servicesAPI
    .post('/v1/justgiving/graphql', {
      query,
      variables: {
        id: getUID(params.campaign),
        limit: params.limit || 100,
        type: params.type === 'team' ? 'TEAMS' : 'FUNDRAISERS'
      }
    })
    .then(response => response.data)
    .then(result => lodashGet(result, 'data.page.leaderboard.nodes', []))
    .then(pages =>
      pages.filter(item => lodashGet(item, 'donationSummary.totalAmount.value'))
    )
    .then(pages =>
      orderBy(pages, ['donationSummary.totalAmount.value'], ['desc'])
    )
    .then(results => results.filter(item => item.slug))
    .then(results => removeExcludedPages(results, params.excludePageIds))
}

export const fetchLegacyLeaderboard = params => {
  const isTeam = params.type === 'team'
  const maxPerRequest = 20
  const { results = [], ...otherParams } = params

  return get(
    '/donationsleaderboards/v1/leaderboard',
    {
      ...otherParams,
      currencyCode: currencyCode(params.country)
    },
    {
      mappings: {
        campaign: 'campaignGuids',
        charity: 'charityIds',
        excludePageIds: 'excludePageGuids',
        limit: 'take',
        page: 'offset',
        type: 'groupBy'
      },
      transforms: {
        campaign: splitOnDelimiter,
        charity: splitOnDelimiter,
        excludePageIds: splitOnDelimiter,
        limit: val => Math.min(maxPerRequest, val || 10),
        page: val =>
          String(
            val ? Math.min(maxPerRequest, params.limit || 10) * (val - 1) : 0
          ),
        type: val => (isTeam ? 'TeamGuid' : 'PageGuid')
      }
    },
    { paramsSerializer }
  )
    .then(response => {
      const { currentPage, lastRowOnPage, pageCount } = response.meta
      const updatedResults = [...results, ...response.results]

      if (currentPage >= pageCount || lastRowOnPage >= params.limit) {
        return updatedResults
      }

      return fetchLegacyLeaderboard({
        ...params,
        results: updatedResults,
        page: currentPage + 1
      })
    })
    .then(results =>
      results.filter(result => (isTeam ? result.team : result.page))
    )
    .then(results => mapLeaderboardResults(results, isTeam))
    .then(results => removeExcludedPages(results, params.excludePageIds))
    .then(results => results.filter(item => item.status !== 'Cancelled'))
    .then(results => orderBy(results, ['donationAmount'], ['desc']))
}

const removeExcludedPages = (results = [], pageIds) => {
  if (!pageIds) return results

  const identifierKeys = [
    'eventGivingGroupId',
    'legacyId',
    'pageGuid',
    'pageShortName',
    'pageId',
    'shortName',
    'slug',
    'id',
    'tagValue'
  ]

  return results.filter(page =>
    identifierKeys.reduce((current, key) => {
      if (!page[key]) return current
      return current ? pageIds.indexOf(page[key].toString()) < 0 : false
    }, true)
  )
}

const mapLeaderboardResults = (results = [], isTeam) => {
  return results.map(result => {
    return isTeam
      ? {
          ...result,
          ...result.team,
          currencyCode: lodashGet(
            result.team,
            'fundraisingConfiguration.currencyCode'
          ),
          donationAmount:
            lodashGet(result, 'team.donationSummary.totalAmount') ||
            result.donationAmount,
          eventName: [
            result.team.captain.firstName,
            result.team.captain.lastName
          ].join(' '),
          numberOfSupporters: result.team.numberOfSupporters,
          pageId: result.id,
          pageImages: [result.team.coverImageName],
          pageShortName: result.team.shortName,
          target: lodashGet(
            result.team,
            'fundraisingConfiguration.targetAmount'
          ),
          type: 'team'
        }
      : {
          ...result,
          ...result.page,
          donationAmount:
            lodashGet(result, 'page.raisedAmount') || result.donationAmount,
          eventName: [
            result.page.owner.firstName,
            result.page.owner.lastName
          ].join(' '),
          pageId: result.id,
          pageImages: [result.page.photo],
          pageShortName: result.page.shortName,
          numberOfSupporters: result.donationCount,
          type: 'individual'
        }
  })
}

const recursivelyFetchJGLeaderboard = (
  campaign,
  q,
  limit = 10,
  results = [],
  page = 1
) => {
  if (campaign.split(',').length > 1) {
    return Promise.all(
      campaign.split(',').map(id => recursivelyFetchJGLeaderboard(id, q, limit))
    )
      .then(flatten)
      .then(results => orderBy(results, ['raisedAmount'], ['desc']))
  }

  const options = {
    params: { page, q }
  }

  return servicesAPI
    .get(`/v1/justgiving/campaigns/${campaign}/pages`, options)
    .then(response => response.data)
    .then(data => {
      const { currentPage, totalPages } = data.meta
      const updatedResults = [...results, ...data.results]

      if (currentPage === totalPages || page * 10 >= limit) {
        return updatedResults
      } else {
        return recursivelyFetchJGLeaderboard(
          campaign,
          q,
          limit,
          updatedResults,
          page + 1
        )
      }
    })
}

/**
 * @function a default deserializer for leaderboard pages
 */
export const deserializeLeaderboard = (supporter, index) => {
  const isTeam =
    supporter.type === 'team' ||
    lodashGet(supporter, 'slug', '').indexOf('team/') === 0
  const slug =
    supporter.pageShortName ||
    supporter.shortName ||
    (supporter.slug
      ? supporter.slug.replace(/(fundraising|team)\//, '')
      : undefined)
  const owner =
    lodashGet(supporter, 'pageOwner.fullName') ||
    lodashGet(supporter, 'owner.firstName')
      ? [supporter.owner.firstName, supporter.owner.lastName].join(' ')
      : typeof supporter.owner === 'string'
        ? supporter.owner
        : null

  return {
    currency:
      supporter.currencyCode ||
      lodashGet(supporter, 'donationSummary.totalAmount.currencyCode'),
    currencySymbol: supporter.currencySymbol,
    donationUrl: isTeam ? null : `${baseUrl()}/fundraising/${slug}/donate`,
    id: supporter.pageId || supporter.legacyId,
    image: lodashGet(supporter, 'heroMedia.url')
      ? `${lodashGet(supporter, 'heroMedia.url')}?template=Size186x186Crop`
      : supporter.defaultImage ||
        imageUrl(lodashGet(supporter, 'cover.url'), 'Size186x186Crop') ||
        imageUrl(lodashGet(supporter, 'pageImages[0]'), 'Size186x186Crop') ||
        imageUrl(supporter.photo, 'Size186x186Crop') ||
        imageUrl(lodashGet(supporter, 'owner.avatar'), 'Size186x186Crop') ||
        (isTeam
          ? 'https://assets.blackbaud-sites.com/images/supporticon/user.svg'
          : apiImageUrl(slug, 'Size186x186Crop')),
    name:
      supporter.pageTitle ||
      supporter.name ||
      supporter.title ||
      supporter.tagValue ||
      lodashGet(supporter, 'pageOwner.fullName'),
    offline: parseFloat(
      supporter.totalRaisedOffline ||
        supporter.raisedOfflineAmount ||
        getMonetaryValue(lodashGet(supporter, 'donationSummary.offlineAmount'))
    ),
    owner,
    ownerImage: imageUrl(
      lodashGet(supporter, 'owner.avatar'),
      'Size186x186Crop'
    ),
    position: index + 1,
    raised: parseFloat(
      lodashGet(supporter, 'team.donationSummary.totalAmount') ||
        supporter.donationAmount ||
        supporter.amount ||
        supporter.raisedAmount ||
        supporter.amountRaised ||
        getMonetaryValue(lodashGet(supporter, 'donationSummary.totalAmount')) ||
        lodashGet(supporter, 'amounts[8].value', 0) ||
        0
    ),
    slug,
    status: lodashGet(supporter, 'page.status') || supporter.status,
    subtitle:
      owner || supporter.eventName || lodashGet(supporter, 'owner.name'),
    target:
      supporter.targetAmount ||
      supporter.target ||
      getMonetaryValue(lodashGet(supporter, 'targetWithCurrency')),
    totalDonations:
      supporter.numberOfSupporters ||
      supporter.donationCount ||
      lodashGet(supporter, 'donationSummary.donationCount') ||
      lodashGet(supporter, 'amounts[0].value', 0),
    url:
      supporter.url ||
      [baseUrl(), isTeam ? 'team' : 'fundraising', slug].join('/')
  }
}
