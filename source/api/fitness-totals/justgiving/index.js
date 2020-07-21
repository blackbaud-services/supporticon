import get from 'lodash/get'
import * as client from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
import { deserializeTotals } from '../../../utils/totals'

export const fetchFitnessSummary = (campaign = required(), types) =>
  Promise.reject(new Error('This method is not supported for JustGiving'))

export const fetchFitnessTotals = (campaign = required(), useLegacy) => {
  if (useLegacy) {
    return client
      .get(
        '/v1/fitness/campaign',
        { campaignGuid: campaign },
        {},
        { paramsSerializer }
      )
      .then(result => ({
        distance: result.totalAmount,
        duration: result.totalAmountTaken,
        elevation: result.totalAmountElevation
      }))
  }

  const query = `
    {
      totals(
        segment: "page:campaign:${campaign}",
        tagDefinitionId: "page:campaign",
        tagValue: "page:campaign:${campaign}"
      ) {
        measurementDomain
        amounts {
          value
          unit
        }
      }
    }
  `

  return client.servicesAPI
    .post('/v1/justgiving/graphql', { query })
    .then(response => response.data)
    .then(result => get(result, 'data.totals', []))
    .then(deserializeTotals)
}
