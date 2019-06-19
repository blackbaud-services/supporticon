import { get, servicesAPI } from '../../../utils/client'
import { getUID, required, dataSource } from '../../../utils/params'

export const fetchPagesTotals = (params = required()) => {
  switch (dataSource(params)) {
    case 'event':
      return get(`v1/event/${getUID(params.event)}/pages`).then(
        response => response.totalFundraisingPages
      )
    case 'charity':
      // No API method supports total number of pages for a charity
      return required()
    default:
      return servicesAPI
        .get(`/v1/justgiving/campaigns/${getUID(params.campaign)}/leaderboard`)
        .then(response => response.data)
        .then(data => data.meta.totalResults)
  }
}
