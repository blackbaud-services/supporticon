import { isJustGiving } from '../../utils/client'

import {
  deserializeCharity as deserializeJGCharity,
  searchCharities as searchJGCharities
} from './justgiving'

import {
  deserializeCharity as deserializeEDHCharity,
  searchCharities as searchEDHCharities
} from './everydayhero'

export const searchCharities = params => {
  return isJustGiving() ? searchJGCharities(params) : searchEDHCharities(params)
}

export const deserializeCharity = charity => {
  return isJustGiving() ? deserializeJGCharity(charity) : deserializeEDHCharity(charity)
}
