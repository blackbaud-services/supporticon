import moment from 'moment'
import lodashGet from 'lodash/get'
import { get, post, destroy, servicesAPI } from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
import { convertToMeters, convertToSeconds } from '../../../utils/units'
import jsonDate from '../../../utils/jsonDate'
import { encodeBase64String } from '../../../utils/base64'

const getTimelineId = activity => {
  if (activity.ActivityType === 'Strava') {
    return encodeBase64String(
      [
        'Timeline:FUNDRAISING',
        activity.PageGuid,
        'FITNESS:STRAVA',
        activity.ExternalId
      ].join(':')
    )
  }

  return undefined
}

export const deserializeFitnessActivity = (activity = required()) => ({
  campaign: activity.CampaignGuid,
  charity: activity.CharityId,
  createdAt: jsonDate(activity.DateCreated),
  description: activity.Description,
  distance: activity.Value,
  duration: activity.TimeTaken,
  elevation: activity.Elevation,
  eventId: activity.EventId,
  externalId: !activity.ExternalId ? null : activity.ExternalId,
  id: activity.id || activity.Id || activity.FitnessGuid,
  manual: activity.ActivityType === 'Manual',
  message: activity.Title,
  page: activity.PageGuid,
  slug: activity.PageShortName,
  source: activity.ActivityType
    ? activity.ActivityType.toLowerCase()
    : 'manual',
  sourceUrl: activity.ExternalId
    ? `https://www.strava.com/activities/${activity.ExternalId}`
    : null,
  teamId: activity.TeamGuid,
  timelineId: getTimelineId(activity),
  type: activity.Type || activity.ActivityType
})

export const fetchFitnessActivities = (params = required()) => {
  const query = {
    limit: params.limit || 100,
    offset: params.offset || 0,
    start: params.startDate,
    end: params.endDate
  }

  if (params.page) {
    return get(`/v1/fitness/fundraising/${params.page}`, query).then(
      response => response.activities
    )
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

export const createFitnessActivity = ({
  pageSlug = required(),
  token = required(),
  caption,
  description,
  distance = 0,
  duration = 0,
  durationUnit,
  elevation = 0,
  elevationUnit,
  startedAt,
  type = 'walk',
  unit
}) =>
  post(
    '/v1/fitness',
    {
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
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

export const updateFitnessActivity = (id = required(), params = required()) =>
  Promise.reject(new Error('This method is not supported by JustGiving'))

export const deleteTimelineFitnessActivity = ({
  id = required(),
  token = required()
}) => {
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
    .then(response => response.data)
    .then(result => lodashGet(result, 'data.deleteTimelineEntry'))
}

export const deleteFitnessActivity = ({
  id = required(),
  page = required(),
  token = required()
}) =>
  destroy(`/v1/fitness/fundraising/${page}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
