import { isJustGiving } from '../../utils/client'
import { searchCharities as searchJGCharities } from './justgiving'
import { searchCharities as searchEDHCharities } from './everydayhero'

export const searchCharities = params => {
  return isJustGiving() ? searchJGCharities(params) : searchEDHCharities(params)
}
