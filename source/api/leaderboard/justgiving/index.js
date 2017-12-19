import { get } from '../../../utils/client'
import { required } from '../../../utils/params'
import compact from 'lodash/compact'
import orderBy from 'lodash/orderBy'
import range from 'lodash/range'

/**
* @function fetches fundraising pages ranked by funds raised
*/
export const fetchLeaderboard = ({
  campaign = required(),
  charity = required()
}) => {
  const url = `/v1/campaigns/${charity}/${campaign}/pages`
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

/**
* @function a default deserializer for leaderboard pages
*/
export const deserializeLeaderboard = (supporter, index) => ({
  position: index + 1,
  id: supporter.pageId,
  name: supporter.pageTitle,
  event: supporter.eventName,
  url: `https://${supporter.domain}/${supporter.pageShortName}`,
  image: `https://images.jg-cdn.com/image/${supporter.pageImages[0]}?template=Size200x200`,
  raised: supporter.raisedAmount,
  target: supporter.targetAmount,
  currency: supporter.currencyCode,
  currencySymbol: supporter.currencySymbol
})
