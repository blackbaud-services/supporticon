import { isJustGiving } from '../../utils/client'

import {
  deserializeFitnessLeaderboard as deserializeEDHFitnessLeaderboard,
  fetchFitnessLeaderboard as fetchEDHFitnessLeaderboard
} from './everydayhero'

import {
  deserializeFitnessLeaderboard as deserializeJGFitnessLeaderboard,
  fetchFitnessLeaderboard as fetchJGFitnessLeaderboard
} from './everydayhero'

/**
 * @function fetches supporter pages ranked by fitness activities
 */
export const fetchFitnessLeaderboard = params =>
  isJustGiving()
    ? fetchJGFitnessLeaderboard(params)
    : fetchEDHFitnessLeaderboard(params)

/**
 * @function a default deserializer for leaderboard pages
 */
export const deserializeFitnessLeaderboard = (result, index) =>
  isJustGiving()
    ? deserializeJGFitnessLeaderboard(result, index)
    : deserializeEDHFitnessLeaderboard(result, index)
