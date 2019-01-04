import moment from 'moment'
import uuid from 'uuid/v1'
import { get, post } from '../../../utils/client'
import { required } from '../../../utils/params'

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
  caption: activity.caption,
  trainer: activity.trainer,
  type: activity.type,
  uid: activity.uid,
  virtual: activity.virtual
})

const mappings = { type: 'type' }

export const fetchFitnessActivities = (params = required()) =>
  get('api/v2/search/fitness_activities', params, { mappings }).then(
    response => response.fitness_activities
  )

export const createFitnessActivity = ({
  token = required(),
  type = required(),
  duration = required(),
  manual = true,
  startedAt = moment().toISOString(),
  uid = uuid(),
  visible = true,
  calories,
  caption,
  coordinates,
  description,
  distance,
  distanceInMeters,
  elevationSeries,
  trainer,
  virtual,
  pageId,
  unit
}) =>
  post(`/api/v2/fitness_activities?access_token=${token}`, {
    calories,
    caption,
    coordinates,
    description,
    distance_in_meters: distanceInMeters,
    distance,
    duration_in_seconds: duration,
    elevation_series: elevationSeries,
    manual,
    public: visible,
    started_at: startedAt,
    trainer,
    type,
    uid,
    unit,
    virtual
  })
