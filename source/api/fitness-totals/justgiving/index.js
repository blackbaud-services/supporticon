import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchFitnessSummary = (campaign = required(), types) => {
  return Promise.reject(
    new Error('This method is not supported for JustGiving')
  )
}

export const fetchFitnessTotals = (campaign = required()) =>
  get(`/v1/fitness/campaign/${campaign}`)
