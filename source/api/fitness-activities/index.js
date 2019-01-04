import { isJustGiving } from '../../utils/client'

import {
  deserializeFitnessActivity as deserializeEDHFitnessActivity,
  fetchFitnessActivities as fetchEDHFitnessActivities,
  createFitnessActivity as createEDHFitnessActivity
} from './everydayhero'

import {
  deserializeFitnessActivity as deserializeJGFitnessActivity,
  fetchFitnessActivities as fetchJGFitnessActivities,
  createFitnessActivity as createJGFitnessActivity
} from './justgiving'

export const deserializeFitnessActivity = activity =>
  isJustGiving()
    ? deserializeJGFitnessActivity(activity)
    : deserializeEDHFitnessActivity(activity)

export const fetchFitnessActivities = params =>
  isJustGiving()
    ? fetchJGFitnessActivities(params)
    : fetchEDHFitnessActivities(params)

export const createFitnessActivity = params =>
  isJustGiving()
    ? createJGFitnessActivity(params)
    : createEDHFitnessActivity(params)
