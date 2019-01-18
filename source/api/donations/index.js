import { isJustGiving } from '../../utils/client'

import { replyToDonation as replyToEDHDonation } from './everydayhero'

import { replyToDonation as replyToJGDonation } from './justgiving'

export const replyToDonation = params =>
  isJustGiving() ? replyToJGDonation(params) : replyToEDHDonation(params)
