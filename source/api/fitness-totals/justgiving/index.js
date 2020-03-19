import * as client from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'

export const fetchFitnessSummary = (campaign = required(), types) =>
  Promise.reject(new Error('This method is not supported for JustGiving'))

export const fetchFitnessTotals = (campaign = required()) => {
  const query = {
    campaignGuid: campaign
  }

  return client
    .get('/v1/fitness/campaign', query, {}, { paramsSerializer })
    .then(result => ({
      distance: result.totalAmount,
      elevation: result.totalAmountElevation
    }))
}
