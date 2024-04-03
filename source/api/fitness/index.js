import capitalize from 'lodash/capitalize'
import { get, servicesAPI } from '../../utils/client'
import { encodeBase64String } from '../../utils/base64'
import { required } from '../../utils/params'

export const allowedActivityTypes = [
  'hike',
  'ride',
  'run',
  'swim',
  'walk',
  'wheelchair'
]

export const fetchPageFitness = ({
  slug = required(),
  limit = 100,
  offset = 0,
  startDate,
  endDate
}) => {
  const params = { limit, offset, start: startDate, end: endDate }
  return get(`/v1/fitness/fundraising/${slug}`, params).then(res =>
    servicesAPI.get(`/v1/justgiving/page/${slug}/fitnessTotal?startDate=${startDate}&endDate=${endDate}`).then(({ data }) => {
      return {
        ...res,
        totalAmount: data.distance,
        totalAmountElevation: data.elevation,
        totalAmountTaken: data.duration
      }
    })
  )
}

export const connectFitness = ({
  code = required(),
  token = required(),
  scope = 'read,activity:read',
  provider = 'strava'
}) => {
  const query = `
    mutation {
      ${provider === 'fitbit' ? 'connectFitbit' : 'connectFitness'} (
        input: {
          code: "${code}"
          scope: "${scope}"
        }
      )
    }
  `

  const headers = { Authorization: `Bearer ${token}` }

  return servicesAPI
    .post('/v1/justgiving/graphql', { query }, { headers })
    .then(response => response.data)
}

export const disconnectFitness = ({
  pageId = required(),
  token = required(),
  provider = 'Strava'
}) => {
  const query = `
    mutation {
      setFitnessApplicationSettings(
        input: {
          pageId: "${encodeBase64String(`Page:FUNDRAISING:${pageId}`)}",
          name: "${capitalize(provider)}",
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

export const updateFitnessSettings = ({
  pageId = required(),
  token = required(),
  provider = 'Strava',
  measurementSystem = 'METRIC',
  subscribedActivities = allowedActivityTypes,
  showDistance = true,
  showDuration = true,
  showElevation = true,
  showPhotos = false,
  showMap = false,
  showTotaliser = true
}) => {
  const filteredActivityTypes = subscribedActivities
    .filter(type => allowedActivityTypes.indexOf(type.toLowerCase()) > -1)
    .map(type => type.toUpperCase())

  const query = `
    mutation {
      setFitnessApplicationSettings(
        input: {
          pageId: "${encodeBase64String(`Page:FUNDRAISING:${pageId}`)}",
          name: "${capitalize(provider)}",
          measurementSystem: ${measurementSystem.toUpperCase()}
          subscribedActivities: [${filteredActivityTypes}]
          showDistance: ${showDistance}
          showDuration: ${showDuration}
          showElevation: ${showElevation}
          showPhotos: ${showPhotos}
          showMap: ${showMap}
          showTotaliser: ${showTotaliser}
        }
      ) {
        measurementSystem
        subscribedActivities
        showDistance
        showDuration
        showElevation
        showPhotos
        showMap
        showTotaliser
      }
    }
  `

  const headers = { Authorization: `Bearer ${token}` }

  return servicesAPI
    .post('/v1/justgiving/graphql', { query }, { headers })
    .then(response => response.data)
}
