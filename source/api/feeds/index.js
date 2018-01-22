import { isJustGiving } from '../../utils/client'

import {
  fetchDonationFeed as fetchJGDonationFeed,
  deserializeDonation as deserializeJGDonation
} from './justgiving'

import {
  fetchDonationFeed as fetchEDHDonationFeed,
  deserializeDonation as deserializeEDHDonation
} from './everydayhero'

/**
* @function fetch a donation feed for a campaign
*/
export const fetchDonationFeed = (params) => (
  isJustGiving()
    ? fetchJGDonationFeed(params)
    : fetchEDHDonationFeed(params)
)

/**
* @function deserialize a donation
*/
export const deserializeDonation = (data) => (
  isJustGiving()
    ? deserializeJGDonation(data)
    : deserializeEDHDonation(data)
)
