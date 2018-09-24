import { get } from '../../../utils/client'
import {
  getShortName,
  getUID,
  required,
  dataSource
} from '../../../utils/params'

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
      return get(
        `v1/campaigns/${getShortName(params.charity)}/${getShortName(
          params.campaign
        )}/pages`
      ).then(response => response.totalFundraisingPages)
  }
}
