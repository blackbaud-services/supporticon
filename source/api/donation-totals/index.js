import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  fetchDonationTotals as fetchJGDonationTotals,
  deserializeDonationTotals as deserializeJGTotals
} from './justgiving'

import {
  fetchDonationTotals as fetchEDHDonationTotals,
  deserializeDonationTotals as deserializeEDHTotals
} from './everydayhero'

export const fetchDonationTotals = (params = required()) => {
  return isJustGiving()
    ? fetchJGDonationTotals(params)
    : fetchEDHDonationTotals(params)
}

export const deserializeDonationTotals = (totals, excludeOffline) => {
  return isJustGiving()
    ? deserializeJGTotals(totals)
    : deserializeEDHTotals(totals, excludeOffline)
}
