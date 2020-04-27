import { get, servicesAPI } from '../../../utils/client'
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
      const eventIds = Array.isArray(params.event)
        ? params.event
        : [params.event]

      return Promise.all(eventIds.map(getUID).map(fetchEvent)).then(events =>
        events.reduce((acc, total) => acc + total, 0)
      )
    default:
      return Promise.reject(
        new Error(
          'This method currently only supports using the event parameter for JustGiving'
        )
      )
  }
}
