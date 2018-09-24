import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  fetchLeaderboard as fetchJGLeaderboard,
  deserializeLeaderboard as deserializeJGLeaderboard
} from './justgiving'

import {
  fetchLeaderboard as fetchEDHLeaderboard,
  deserializeLeaderboard as deserializeEDHLeaderboard
} from './everydayhero'

/**
 * @function fetches pages ranked by funds raised
 */
export const fetchLeaderboard = (params = required()) => {
  return isJustGiving()
    ? fetchJGLeaderboard(params)
    : fetchEDHLeaderboard(params)
}

/**
 * @function a default deserializer for leaderboard pages
 */
export const deserializeLeaderboard = (page, index) => {
  return isJustGiving()
    ? deserializeJGLeaderboard(page, index)
    : deserializeEDHLeaderboard(page, index)
}
