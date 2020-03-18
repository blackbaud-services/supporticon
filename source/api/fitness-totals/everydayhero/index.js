import { required } from '../../../utils/params'
import pick from 'lodash/pick'
import isEmpty from 'lodash/isEmpty'
import fitnessTypes from '../consts/fitness-types'

import { fetchCampaign, fetchCampaigns } from '../../campaigns'

export const fetchFitnessSummary = (campaign = required(), types) =>
  Array.isArray(campaign)
    ? fetchCampaigns({ ids: campaign })
      .then(results => results.map(result => deserializeOverview(result)))
      .then(results => combineMultipleCampaigns(results))
      .then(results => (types ? filterTypes(results, types) : results))
      .catch(err => console.log(err))
    : fetchCampaign(campaign)
      .then(result => deserializeOverview(result))
      .then(results => (types ? filterTypes(results, types) : results))
      .catch(err => console.log(err))

export const fetchFitnessTotals = (campaign = required(), types) =>
  fetchFitnessSummary(campaign, types)
    .then(summary =>
      Object.keys(summary).reduce(
        (result, item, i) => ({
          duration: result.duration + summary[item].duration,
          calories: result.calories + summary[item].calories,
          distance: result.distance + summary[item].distance
        }),
        { duration: 0, calories: 0, distance: 0 }
      )
    )
    .catch(err => console.log(err))

const deserializeOverview = ({ fitness_activity_overview: overview }) =>
  fitnessTypes.reduce((result, fitnessType, i) => {
    const key = overview[fitnessType] || {}
    return {
      ...result,
      [fitnessType]: {
        duration: key.duration_in_seconds || 0,
        calories: key.calories || 0,
        distance: key.distance_in_meters || 0
      }
    }
  }, {})

const combineMultipleCampaigns = campaigns =>
  fitnessTypes.reduce((result, fitnessType, i) => {
    return {
      ...result,
      [fitnessType]: {
        duration: addValuesFromAllCampaigns(campaigns, fitnessType, 'duration'),
        calories: addValuesFromAllCampaigns(campaigns, fitnessType, 'calories'),
        distance: addValuesFromAllCampaigns(campaigns, fitnessType, 'distance')
      }
    }
  }, {})

const addValuesFromAllCampaigns = (campaigns, fitnessType, key) =>
  campaigns.reduce(
    (result, campaign, i) => result + campaign[fitnessType][key],
    0
  )

const filterTypes = (results, types) => {
  const filtered = pick(results, types)
  return !isEmpty(filtered) ? filtered : results
}
