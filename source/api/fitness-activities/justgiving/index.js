import { required } from '../../../utils/params'

export const deserializeFitnessActivity = (activity = required()) =>
  Promise.reject('This method is not supported for JustGiving')

export const fetchFitnessActivities = (params = required()) =>
  Promise.reject('This method is not supported for JustGiving')

export const createFitnessActivity = (params = required()) =>
  Promise.reject('This method is not supported for JustGiving')
