import lodashGet from 'lodash/get'
import { get, servicesAPI } from '../../../utils/client'
import { apiImageUrl, baseUrl, imageUrl } from '../../../utils/justgiving'
import {
  getUID,
  required,
  dataSource,
  paramsSerializer
} from '../../../utils/params'
import { currencySymbol, currencyCode } from '../../../utils/currencies'

/**
 * @function fetches fundraising pages ranked by funds raised
 */
export const fetchLeaderboard = (params = required()) => {
  if (params.campaign && params.allPages) {
    return recursivelyFetchJGLeaderboard(
      getUID(params.campaign),
      params.q,
      params.limit
    )
  }

  switch (dataSource(params)) {
    case 'event':
      return get(
        '/v1/events/leaderboard',
        {
          eventid: Array.isArray(params.event)
            ? params.event.map(getUID)
            : getUID(params.event),
          currency: currencyCode(params.country),
          maxResults: params.limit
        },
        {},
        { paramsSerializer }
      ).then(response =>
        response.pages.map(page => ({
          ...page,
          raisedAmount: page.amount,
          eventName: response.eventName,
          currencyCode: response.currency,
          currencySymbol: currencySymbol(response.currency)
        }))
      )
    default:
      const isTeam = params.type === 'team'

      return get(
        'donationsleaderboards/v1/leaderboard',
        {
          ...params,
          currencyCode: currencyCode(params.country)
        },
        {
          mappings: {
            charity: 'charityIds',
            campaign: 'campaignGuids',
            excludePageIds: 'excludePageGuids',
            limit: 'take',
            type: 'groupBy'
          },
          transforms: {
            type: val => (isTeam ? 'TeamGuid' : 'PageGuid')
          }
        },
        { paramsSerializer }
      )
        .then(response => response.results)
        .then(results => filterLeaderboardResults(results, isTeam))
        .then(results => mapLeaderboardResults(results, isTeam))
  }
}

const filterLeaderboardResults = (results = [], isTeam) => {
  return results.filter(result => (isTeam ? result.team : result.page))
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
        eventName: [
          result.page.owner.firstName,
          result.page.owner.lastName
        ].join(' '),
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
  const options = {
    params: { page, q }
  }

  return servicesAPI
    .get(`/v1/justgiving/campaigns/${campaign}/leaderboard`, options)
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
  const isTeam = supporter.type === 'team'

  return {
    currency: supporter.currencyCode,
    currencySymbol: supporter.currencySymbol,
    donationUrl: isTeam
      ? null
      : `${baseUrl()}/fundraising/${supporter.pageShortName}/donate`,
    id: supporter.pageId,
    image:
      supporter.defaultImage ||
      imageUrl(lodashGet(supporter, 'pageImages[0]'), 'Size186x186Crop') ||
      (isTeam
        ? 'https://assets.blackbaud-sites.com/images/supporticon/user.svg'
        : apiImageUrl(supporter.pageShortName, 'Size186x186Crop')),
    name:
      supporter.pageTitle ||
      supporter.name ||
      (supporter.pageOwner && supporter.pageOwner.fullName),
    offline: parseFloat(
      supporter.totalRaisedOffline || supporter.raisedOfflineAmount || 0
    ),
    position: index + 1,
    raised: parseFloat(
      supporter.amount ||
        supporter.raisedAmount ||
        supporter.amountRaised ||
        supporter.donationAmount ||
        0
    ),
    slug: supporter.pageShortName,
    subtitle: supporter.eventName,
    target: supporter.targetAmount || supporter.target,
    totalDonations: supporter.numberOfSupporters || supporter.donationCount,
    url: [
      baseUrl(),
      isTeam ? 'team' : 'fundraising',
      supporter.pageShortName
    ].join('/')
  }
}
