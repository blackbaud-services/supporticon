import * as client from '../../../utils/client'
import {
  isParamsObject,
  paramsSerializer,
  required
} from '../../../utils/params'

export const fetchFitnessSummary = (campaign = required(), types) =>
  Promise.reject(new Error('This method is not supported for JustGiving'))

export function fetchFitnessTotals (params) {
  let query = {}

  if (isParamsObject(arguments)) {
    query = {
      campaignGuid: params.campaign,
      limit: params.limit || 100,
      offset: params.offset || 0,
      start: params.startDate,
      end: params.endDate
    }
  } else {
    query = { campaignGuid: arguments[0] }
  }

  if (!query.campaignGuid) {
    return required()
  }

  return client
    .get('/v1/fitness/campaign', query, {}, { paramsSerializer })
    .then(result => ({
      distance: result.totalAmount,
      duration: result.totalAmountTaken,
      elevation: result.totalAmountElevation
    }))
}
