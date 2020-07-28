import { isJustGiving } from '../../utils/client'

import {
  deserializeFitnessActivity as deserializeEDHFitnessActivity,
  fetchFitnessActivities as fetchEDHFitnessActivities,
  createFitnessActivity as createEDHFitnessActivity,
  updateFitnessActivity as updateEDHFitnessActivity,
  deleteFitnessActivity as deleteEDHFitnessActivity
} from './everydayhero'

import {
  deserializeFitnessActivity as deserializeJGFitnessActivity,
  fetchFitnessActivities as fetchJGFitnessActivities,
  createFitnessActivity as createJGFitnessActivity,
  updateFitnessActivity as updateJGFitnessActivity,
  deleteFitnessActivity as deleteJGFitnessActivity
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

export const updateFitnessActivity = (activityId, params) =>
  isJustGiving()
    ? updateJGFitnessActivity(activityId, params)
    : updateEDHFitnessActivity(activityId, params)

export const deleteFitnessActivity = (...args) =>
  isJustGiving()
    ? deleteJGFitnessActivity(...args)
    : deleteEDHFitnessActivity(...args)
