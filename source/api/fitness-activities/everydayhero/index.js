import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { destroy, get, post, put } from '../../../utils/client'
import { required } from '../../../utils/params'
import { convertToMeters, convertToSeconds } from '../../../utils/units'

export const deserializeFitnessActivity = (activity = required()) => ({
  calories: activity.calories,
  campaign: activity.campaign_uid,
  charity: activity.charity_uid,
  coordinate: activity.coordinate,
  createdAt: activity.created_at,
  deleted: activity.deleted,
  distance: activity.distance_in_meters,
  duration: activity.duration_in_seconds,
  elevation: activity.elevation_in_meters,
  elevationSeries: activity.elevation_series,
  flagged: activity.flagged,
  groups: activity.page_groups,
  id: activity.id,
  manual: activity.manual,
  mapUrls: activity.map_urls,
  page: activity.page_id,
  polyline: activity.polyline,
  public: activity.public,
  source: activity.source,
  sourceUrl: activity.source_url,
  startedAt: activity.started_at,
  team: activity.team_id,
  message: activity.caption,
  trainer: activity.trainer,
  type: activity.type,
  uid: activity.uid,
  virtual: activity.virtual
})

export const fetchFitnessActivities = (params = required()) => {
  const mappings = {
    campaign: 'campaign_id',
    charity: 'charity_id',
    page: 'page_id',
    team: 'team_id',
    type: 'type',
    index: 'page'
  }

  return get('api/v2/search/fitness_activities', params, { mappings }).then(
    response => response.fitness_activities
  )
}

export const createFitnessActivity = ({
  token = required(),
  type = required(),
  calories,
  caption,
  coordinates,
  description,
  distance = 0,
  duration = 0,
  durationUnit,
  elevation = 0,
  elevationSeries,
  elevationUnit,
  manual = true,
  pageId,
  startedAt = moment().toISOString(),
  trainer,
  uid = uuid(),
  unit,
  virtual,
  visible = true
}) =>
  post(`/api/v2/fitness_activities?access_token=${token}`, {
    calories,
    caption,
    coordinates,
    description,
    distance_in_meters: convertToMeters(distance, unit),
    duration_in_seconds: convertToSeconds(duration, durationUnit),
    elevation: convertToMeters(elevation, elevationUnit || unit),
    manual,
    page_id: pageId,
    public: visible,
    started_at: startedAt,
    trainer,
    type,
    uid,
    virtual
  })

export const updateFitnessActivity = (
  id = required(),
  {
    token = required(),
    type,
    duration,
    manual,
    startedAt,
    uid,
    visible,
    calories,
    caption,
    coordinates,
    description,
    distance,
    distanceInMeters,
    elevationSeries,
    pageId,
    trainer,
    unit,
    virtual
  }
) =>
  put(`/api/v2/fitness_activities/${id}?access_token=${token}`, {
    calories,
    caption,
    coordinates,
    description,
    distance_in_meters: distanceInMeters,
    distance,
    duration_in_seconds: duration,
    elevation_series: elevationSeries,
    manual,
    page_id: pageId,
    public: visible,
    started_at: startedAt,
    trainer,
    type,
    uid,
    unit,
    virtual
  })

export const deleteFitnessActivity = (id = required(), token = required()) =>
  destroy(`/api/v2/fitness_activities/${id}?access_token=${token}`)
