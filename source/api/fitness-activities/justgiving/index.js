import moment from 'moment'
import { get, post } from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
import { convertToMeters, convertToSeconds } from '../../../utils/units'
import jsonDate from '../../../utils/jsonDate'

export const deserializeFitnessActivity = (activity = required()) => ({
  campaign: activity.CampaignGuid,
  charity: activity.CharityId,
  createdAt: jsonDate(activity.DateCreated),
  distance: activity.Value,
  duration: activity.TimeTaken,
  elevation: activity.Elevation,
  externalId: !activity.ExternalId ? null : activity.ExternalId,
  eventId: activity.EventId,
  id: activity.FitnessGuid,
  manual: activity.ActivityType === 'Manual',
  page: activity.PageGuid,
  slug: activity.PageShortName,
  teamId: activity.TeamGuid,
  caption: activity.Title,
  type: activity.Type || activity.ActivityType
})

export const fetchFitnessActivities = (params = required()) => {
  const limit = params.limit || 1000

  if (params.page) {
    return get(`/v1/fitness/fundraising/${params.page}`, { limit }).then(
      response => response.activities
    )
  }

  if (params.team) {
    return get(`/v1/fitness/teams/${params.team}`, { limit }).then(
      response => response.activities
    )
  }

  if (params.campaign) {
    const query = { campaignGuid: params.campaign }

    return get('/v1/fitness/campaign', query, {}, { paramsSerializer }).then(
      response => response.activities
    )
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

export const deleteFitnessActivity = (id = required(), token = required()) =>
  Promise.reject(new Error('This method is not supported by JustGiving'))
