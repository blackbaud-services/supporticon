import { get, servicesAPI } from '../../../utils/client'
import { getUID, required, dataSource } from '../../../utils/params'
import { currencySymbol, currencyCode } from '../../../utils/currencies'

/**
 * @function fetches fundraising pages ranked by funds raised
 */
export const fetchLeaderboard = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return get(`/v1/event/${getUID(params.event)}/leaderboard`, {
        currency: currencyCode(params.country)
      }).then(response =>
        response.pages.map(page => ({
          ...page,
          raisedAmount: page.amount,
          eventName: response.eventName,
          currencyCode: response.currency,
          currencySymbol: currencySymbol(response.currency)
        }))
      )
    case 'charity':
      return get(`/v1/charity/${getUID(params.charity)}/leaderboard`, {
        currency: currencyCode(params.country)
      }).then(response =>
        response.pages.map(page => ({
          ...page,
          raisedAmount: page.amount,
          eventName: response.name,
          currencyCode: response.currency,
          currencySymbol: response.currencySymbol
        }))
      )
    default:
      const options = {
        params: {
          page: params.page,
          q: params.q
        }
      }

      return servicesAPI
        .get(
          `/v1/justgiving/campaigns/${getUID(params.campaign)}/leaderboard`,
          options
        )
        .then(response => response.data)
  }
}

/**
 * @function a default deserializer for leaderboard pages
 */
export const deserializeLeaderboard = (supporter, index) => ({
  currency: supporter.currencyCode,
  currencySymbol: supporter.currencySymbol,
  donationUrl: `https://www.justgiving.com/fundraising/${
    supporter.pageShortName
  }/donate`,
  id: supporter.pageId,
  image:
    supporter.defaultImage ||
    (supporter.pageImages
      ? `https://images.jg-cdn.com/image/${
        supporter.pageImages[0]
      }?template=Size200x200`
      : null),
  name:
    supporter.pageTitle ||
    (supporter.pageOwner && supporter.pageOwner.fullName),
  position: index + 1,
  raised: parseFloat(
    supporter.amount || supporter.raisedAmount || supporter.amountRaised || 0
  ),
  slug: supporter.pageShortName,
  subtitle: supporter.eventName,
  target: supporter.targetAmount || supporter.target,
  totalDonations: supporter.numberOfSupporters,
  url: `https://www.justgiving.com/${supporter.pageShortName}`
})
