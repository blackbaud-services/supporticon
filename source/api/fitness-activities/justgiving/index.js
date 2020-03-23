import { get } from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
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
  page: activity.PageGuid,
  slug: activity.PageShortName,
  teamId: activity.TeamGuid,
  caption: activity.Title,
  type: activity.ActivityType
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

export const createFitnessActivity = (params = required()) =>
  Promise.reject(new Error('This method is not supported by JustGiving'))

export const updateFitnessActivity = (id = required(), params = required()) =>
  Promise.reject(new Error('This method is not supported by JustGiving'))

export const deleteFitnessActivity = (id = required(), token = required()) =>
  Promise.reject(new Error('This method is not supported by JustGiving'))
