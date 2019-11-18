import { get } from '../../../utils/client'
import {
  getUID,
  required,
  dataSource,
  paramsSerializer
} from '../../../utils/params'
import { currencyCode } from '../../../utils/currencies'

const fetchEvent = id =>
  get(`v1/event/${id}/pages`).then(response => response.totalFundraisingPages)

export const fetchPagesTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return Array.isArray(params.event)
        ? Promise.all(params.event.map(getUID).map(fetchEvent)).then(events =>
          events.reduce((acc, total) => acc + total, 0)
        )
        : fetchEvent(getUID(params.event))
    default:
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
            page: 'pageGuids',
            excludePageIds: 'excludePageGuids',
            limit: 'take'
          }
        },
        { paramsSerializer }
      ).then(data => data.totalResults)
  }
}
