import { isJustGiving, servicesAPI } from '../../utils/client'
import { encodeBase64String } from '../../utils/base64'
import { required } from '../../utils/params'

export const disconnectFitness = ({
  pageId = required(),
  token = required(),
  provider = 'Strava'
}) => {
  if (!isJustGiving()) {
    throw new Error('Method not supported')
  }

  const query = `
    mutation {
      setFitnessApplicationSettings(
        input: {
          pageId: "${encodeBase64String(`Page:FUNDRAISING:${pageId}`)}",
          name: "${provider}",
          subscribedActivities: []
        }
      ) {
        subscribedActivities
      }
    }
  `

  const headers = { Authorization: `Bearer ${token}` }

  return servicesAPI
    .post('/v1/justgiving/graphql', { query }, { headers })
    .then(response => response.data)
}
