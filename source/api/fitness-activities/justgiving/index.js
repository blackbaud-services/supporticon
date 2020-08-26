import moment from 'moment'
import capitalize from 'lodash/capitalize'
import lodashGet from 'lodash/get'
import { get, post, destroy, servicesAPI } from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
import { convertToMeters, convertToSeconds } from '../../../utils/units'
import { extractData } from '../../../utils/graphql'
import { encodeBase64String } from '../../../utils/base64'
import jsonDate from '../../../utils/jsonDate'

const getFitnessId = activity => {
  switch (activity.ActivityType) {
    case 'Strava':
      return encodeBase64String(
        [
          'Timeline:FUNDRAISING',
          activity.PageGuid,
          'FITNESS:STRAVA',
          activity.ExternalId
        ].join(':')
      )
    case 'Manual':
    case 'manual':
      return encodeBase64String(
        ['Timeline:FUNDRAISING', activity.PageGuid, activity.ExternalId].join(
          ':'
        )
      )
    default:
      return activity.id || activity.Id || activity.FitnessGuid
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
  const activityType =
    activity.activityType || activity.Type || activity.ActivityType

  return {
    campaign: activity.CampaignGuid,
    charity: activity.CharityId,
    createdAt: jsonDate(activity.DateCreated),
    description: activity.Description || activity.message,
    distance: getMetricValue(activity.distance || activity.Value),
    duration: getMetricValue(activity.duration || activity.TimeTaken),
    elevation: getMetricValue(activity.elevation || activity.Elevation),
    externalId: !activity.ExternalId ? null : activity.ExternalId,
    eventId: activity.EventId,
    id: getFitnessId(activity),
    manual:
      activity.ActivityType === 'Manual' ||
      activity.ActivityType === 'manual' ||
      activity.type === 'MANUAL',
    page: activity.PageGuid,
    slug: activity.PageShortName,
    teamId: activity.TeamGuid,
    message: activity.Title || activity.title,
    type: activityType ? activityType.toLowerCase() : undefined
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
      return get(`/v1/fitness/fundraising/${(params.page, query)}`).then(
        response => response.activities
      )
    }

    const { page, after, allActivities, results = [] } = params

    const query = `
      {
        page(type: FUNDRAISING, slug: "${page}") {
          timeline${after ? `(after: "${after}") ` : ' '} {
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
                activityType
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
      .post('/v1/justgiving/graphql', { query })
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
    case 'bike':
    case 'ride':
      return 'RIDE'
    case 'swim':
      return 'SWIM'
    case 'run':
      return 'RUN'
    case 'hike':
      return 'HIKE'
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

    const createdDate = moment(startedAt).isBefore(moment(), 'day')
      ? `createdDate: "${moment(startedAt).toISOString()}"`
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
              title: "${caption || capitalize(activityType(type))}",
              activityType: ${activityType(type)}
              distance: ${Math.round(convertToMeters(distance, unit))}
              duration: ${Math.round(convertToSeconds(duration, durationUnit))}
              elevation: ${Math.round(
    convertToMeters(elevation, elevationUnit || unit)
  )}
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
    dateCreated: moment(startedAt).isBefore(moment(), 'day')
      ? moment(startedAt).format('DD/MM/YYYY')
      : null,
    description: description,
    distance: convertToMeters(distance, unit),
    duration: convertToSeconds(duration, durationUnit),
    elevation: convertToMeters(elevation, elevationUnit || unit),
    shortName: pageSlug,
    title: caption,
    type
  }

  return post('/v1/fitness', params, { headers })
}

export const updateFitnessActivity = (id = required(), params = required()) =>
  Promise.reject(new Error('This method is not supported by JustGiving'))

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
