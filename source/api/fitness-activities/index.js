import dayjs from 'dayjs'
import lodashGet from 'lodash/get'
import { get, post, destroy, servicesAPI } from '../../utils/client'
import { paramsSerializer, required } from '../../utils/params'
import { convertToMeters, convertToSeconds } from '../../utils/units'
import { extractData } from '../../utils/graphql'
import { encodeBase64String } from '../../utils/base64'
import jsonDate from '../../utils/jsonDate'

import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const getFitnessId = (source, activity) => {
  if (activity.id) return activity.id

  switch (source) {
    case 'fitness':
      return encodeBase64String(
        [
          'Timeline:FUNDRAISING',
          activity.PageGuid,
          'FITNESS:STRAVA',
          activity.ExternalId
        ].join(':')
      )
    case 'manual':
      // legacy activity created via Consumer API
      if (!activity.ExternalId) return null

      return encodeBase64String(
        ['Timeline:FUNDRAISING', activity.PageGuid, activity.ExternalId].join(
          ':'
        )
      )
    default:
      return null
  }
}

const getExternalId = (source, activity) => {
  switch (source) {
    case 'fitness':
      return activity.ExternalId || activity.activityId
    default:
      return null
  }
}

const getFitnessApp = (sourceId, externalId) => {
  if (sourceId.indexOf('STRAVA') !== -1) {
    return {
      product: 'strava',
      sourceUrl: `https://www.strava.com/activities/${externalId}`
    }
  } else if (sourceId.indexOf('FITBIT') !== -1) {
    return {
      product: 'fitbit',
      sourceUrl: `https://www.fitbit.com/activities/exercise/${externalId}`
    }
  } else {
    return {
      product: null,
      sourceUrl: null
    }
  }
}

const getMetricValue = metric => {
  switch (typeof metric) {
    case 'object':
      return lodashGet(metric, 'value', 0)
    default:
      return metric
  }
}

export const deserializeFitnessActivity = (activity = required()) => {
  const activityType = (
    activity.activityType ||
    activity.Type ||
    ''
  ).toLowerCase()

  const sourceId = activity.ExternalId || activity.legacyId || ''
  const source = sourceId.indexOf('JG:MANUAL') === 0 ? 'manual' : 'fitness'
  const fitnessApp = getFitnessApp(sourceId, getExternalId(source, activity))

  return {
    campaign: activity.CampaignGuid,
    charity: activity.CharityId,
    createdAt: activity.createdAt || jsonDate(activity.DateCreated),
    description: activity.Description || activity.message,
    distance: getMetricValue(activity.distance || activity.Value),
    duration: getMetricValue(activity.duration || activity.TimeTaken),
    elevation: getMetricValue(activity.elevation || activity.Elevation),
    externalId: getExternalId(source, activity),
    eventId: activity.EventId,
    fitnessApp: fitnessApp.product,
    id: getFitnessId(source, activity),
    legacyId: activity.Id,
    manual: source === 'manual',
    page: activity.PageGuid,
    polyline: activity.mapPolyline,
    slug: activity.PageShortName,
    source,
    sourceUrl: fitnessApp.sourceUrl,
    teamId: activity.TeamGuid,
    title: activity.Title || activity.title,
    type: activityType
  }
}

export const fetchFitnessActivities = (params = required()) => {
  const query = {
    limit: params.limit || 100,
    offset: params.offset || 0,
    start: params.startDate,
    end: params.endDate
  }

  if (params.page) {
    if (params.useLegacy) {
      return get(`/v1/fitness/fundraising/${params.page}`, query).then(
        response => response.activities
      )
    }

    const { page, after, allActivities, results = [] } = params

    const graphQLQuery = `
      {
        page(type: FUNDRAISING, slug: "${page}") {
          timeline(first: 20${after ? `, after: "${after}"` : ' '}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              legacyId
              message
              type
              createdAt
              fitnessActivity {
                title
                activityId
                activityType
                mapPolyline
                distance { value unit }
                elevation { value unit }
                duration { value unit }
              }
            }
          }
        }
      }
    `

    return servicesAPI
      .post('/v1/justgiving/graphql', { query: graphQLQuery })
      .then(response => response.data)
      .then(result => {
        const data = lodashGet(result, 'data.page.timeline', {})
        const { pageInfo = {}, nodes = [] } = data
        const updatedResults = [...results, ...nodes]

        if (allActivities && pageInfo.hasNextPage) {
          return fetchFitnessActivities({
            page,
            after: pageInfo.endCursor,
            results: updatedResults,
            allActivities: true
          })
        } else {
          return updatedResults
            .filter(activity => activity.fitnessActivity)
            .map(activity => ({
              ...activity,
              ...lodashGet(activity, 'fitnessActivity', {})
            }))
        }
      })
  }

  if (params.team) {
    return get(`/v1/fitness/teams/${params.team}`, query).then(
      response => response.activities
    )
  }

  if (params.campaign) {
    return get(
      '/v1/fitness/campaign',
      { ...query, campaignGuid: params.campaign },
      {},
      { paramsSerializer }
    ).then(response => response.activities)
  }

  return required()
}

const activityType = type => {
  switch (type) {
    case 'ride':
      return 'RIDE'
    case 'swim':
      return 'SWIM'
    case 'run':
      return 'RUN'
    case 'hike':
      return 'HIKE'
    case 'wheelchair':
      return 'WHEELCHAIR'
    default:
      return 'WALK'
  }
}

export const createFitnessActivity = ({
  caption,
  description,
  distance = 0,
  duration = 0,
  durationUnit,
  elevation = 0,
  elevationUnit,
  pageId,
  pageSlug,
  startedAt,
  title,
  type = 'walk',
  token = required(),
  unit,
  userId,
  useLegacy
}) => {
  const headers = { Authorization: `Bearer ${token}` }

  if (!useLegacy) {
    if (!pageId || !userId) {
      return required()
    }

    const createdDate = startedAt
      ? `createdDate: "${dayjs(startedAt).format()}"`
      : ''

    const message = description ? `message: "${description}"` : ''

    const query = `
      mutation {
        createTimelineEntry (
          input: {
            type: FUNDRAISING
            pageId: "${pageId}"
            creatorGuid: "${userId}"
            ${createdDate}
            ${message}
            fitness: {
              title: "${title || caption || ''}",
              activityType: ${activityType(type)}
              distance: ${convertToMeters(distance, unit)}
              duration: ${convertToSeconds(duration, durationUnit)}
              elevation: ${convertToMeters(elevation, elevationUnit || unit)}
            }
          }
        ) {
          id
          message
          createdAt
          fitnessActivity {
            title
            activityType
            distance { value unit }
            elevation { value unit }
            duration { value unit }
          }
        }
      }
    `

    return servicesAPI
      .post('/v1/justgiving/graphql', { query }, { headers })
      .then(response => extractData(response))
      .then(result => ({
        ...lodashGet(result, 'data.createTimelineEntry', {}),
        ...lodashGet(result, 'data.createTimelineEntry.fitnessActivity', {})
      }))
  }

  if (!pageSlug) {
    return required()
  }

  const params = {
    dateCreated: dayjs(startedAt).isBefore(dayjs(), 'day')
      ? dayjs(startedAt).format('DD/MM/YYYY')
      : null,
    description: description,
    distance: convertToMeters(distance, unit),
    duration: convertToSeconds(duration, durationUnit),
    elevation: convertToMeters(elevation, elevationUnit || unit),
    shortName: pageSlug,
    title: title || caption,
    type
  }

  return post('/v1/fitness', params, { headers })
}

export const deleteFitnessActivity = ({
  id = required(),
  page,
  token = required(),
  useLegacy
}) => {
  if (useLegacy) {
    return deleteLegacyFitnessActivity({ id, page, token })
  }

  const query = `
    mutation {
      deleteTimelineEntry (
        input: {
          id: "${id}"
        }
      )
    }
  `

  const headers = { Authorization: `Bearer ${token}` }

  return servicesAPI
    .post('/v1/justgiving/graphql', { query }, { headers })
    .then(response => extractData(response))
    .then(result => lodashGet(result, 'data.deleteTimelineEntry'))
}

export const deleteLegacyFitnessActivity = ({
  id = required(),
  page = required(),
  token = required()
}) =>
  destroy(`/v1/fitness/fundraising/${page}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
