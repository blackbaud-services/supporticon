import { isJustGiving } from '../../utils/client'

import {
  fetchDonation as fetchEDHDonation,
  replyToDonation as replyToEDHDonation
} from './everydayhero'

import {
  fetchDonation as fetchJGDonation,
  replyToDonation as replyToJGDonation
} from './justgiving'

export const fetchDonation = params =>
  isJustGiving() ? fetchJGDonation(params) : fetchEDHDonation(params)

export const replyToDonation = params =>
  isJustGiving() ? replyToJGDonation(params) : replyToEDHDonation(params)
