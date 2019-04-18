import { isJustGiving } from '../../utils/client'

import {
  fetchDonation as fetchEDHDonation,
  replyToDonation as replyToEDHDonation,
  deserializeDonation as deserializeEDHDonation
} from './everydayhero'

import {
  fetchDonation as fetchJGDonation,
  replyToDonation as replyToJGDonation,
  deserializeDonation as deserializeJGDonation
} from './justgiving'

export const fetchDonation = params =>
  isJustGiving() ? fetchJGDonation(params) : fetchEDHDonation(params)

export const replyToDonation = params =>
  isJustGiving() ? replyToJGDonation(params) : replyToEDHDonation(params)

export const deserializeDonation = data =>
  isJustGiving() ? deserializeJGDonation(data) : deserializeEDHDonation(data)
