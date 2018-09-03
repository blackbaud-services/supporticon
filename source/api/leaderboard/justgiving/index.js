import { get } from '../../../utils/client'
import { getShortName, getUID, required, dataSource } from '../../../utils/params'
import { currencySymbol, currencyCode } from '../../../utils/currencies'
import compact from 'lodash/compact'
import orderBy from 'lodash/orderBy'
import range from 'lodash/range'

/**
* @function fetches fundraising pages ranked by funds raised
*/
export const fetchLeaderboard = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return get(`/v1/event/${getUID(params.event)}/leaderboard`, { currency: currencyCode(params.country) }).then((response) => (
        response.pages.map((page) => ({
          ...page,
          raisedAmount: page.amount,
          eventName: response.eventName,
          currencyCode: response.currency,
          currencySymbol: currencySymbol(response.currency)
        }))
      ))
    case 'charity':
      return get(`/v1/charity/${getUID(params.charity)}/leaderboard`, { currency: currencyCode(params.country) }).then((response) => (
        response.pages.map((page) => ({
          ...page,
          raisedAmount: page.amount,
          eventName: response.name,
          currencyCode: response.currency,
          currencySymbol: response.currencySymbol
        }))
      ))
    default:
      const url = `/v1/campaigns/${getShortName(params.charity)}/${getShortName(params.campaign)}/pages`
      const pageSize = 100
      const pageLimit = 10
      const sort = (pages) => orderBy(pages, 'raisedAmount', 'desc')

      return get(url, { pageSize, page: 1 }).then(({ totalPages, fundraisingPages }) => {
        if (totalPages > 1) {
          const upperLimit = Math.min(totalPages, pageLimit)
          const paginatedRequests = range(2, upperLimit + 1).map((page) => {
            return get(url, { pageSize, page: page })
          })

          return Promise.all(paginatedRequests)
          .then((responses) => {
            const paginatedResults = compact(responses.map((res) => res.fundraisingPages))
            return sort(fundraisingPages.concat(paginatedResults))
          })
        }

        return sort(fundraisingPages)
      })
  }
}

/**
* @function a default deserializer for leaderboard pages
*/
export const deserializeLeaderboard = (supporter, index) => ({
  position: index + 1,
  id: supporter.pageId,
  name: supporter.pageTitle,
  subtitle: supporter.eventName,
  url: `https://www.justgiving.com/${supporter.pageShortName}`,
  image: supporter.defaultImage || (supporter.pageImages ? `https://images.jg-cdn.com/image/${supporter.pageImages[0]}?template=Size200x200` : null),
  raised: supporter.amount || supporter.raisedAmount,
  target: supporter.targetAmount,
  currency: supporter.currencyCode,
  currencySymbol: supporter.currencySymbol
})
