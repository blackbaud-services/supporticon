import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  deserializeCharity as deserializeJGCharity,
  fetchCharities as fetchJGCharities,
  fetchCharity as fetchJGCharity,
  searchCharities as searchJGCharities
} from './justgiving'

import {
  deserializeCharity as deserializeEDHCharity,
  fetchCharities as fetchEDHCharities,
  fetchCharity as fetchEDHCharity,
  searchCharities as searchEDHCharities
} from './everydayhero'

export const fetchCharities = (params = required()) => {
  return isJustGiving() ? fetchJGCharities(params) : fetchEDHCharities(params)
}

export const fetchCharity = (id = required()) => {
  return isJustGiving() ? fetchJGCharity(id) : fetchEDHCharity(id)
}

export const searchCharities = params => {
  return isJustGiving() ? searchJGCharities(params) : searchEDHCharities(params)
}

export const deserializeCharity = charity => {
  return isJustGiving()
    ? deserializeJGCharity(charity)
    : deserializeEDHCharity(charity)
}
