import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  deserializeUser as deserializeJGUser,
  fetchCurrentUser as fetchJGCurrentUser,
  updateCurrentUser as updateJGCurrentUser
} from './justgiving'

import {
  deserializeUser as deserializeEDHUser,
  fetchCurrentUser as fetchEDHCurrentUser,
  updateCurrentUser as updateEDHCurrentUser
} from './everydayhero'

export const deserializeUser = (user) => (
  isJustGiving()
    ? deserializeJGUser(user)
    : deserializeEDHUser(user)
)

export const fetchCurrentUser = (params = required()) => {
  return isJustGiving()
    ? fetchJGCurrentUser(params)
    : fetchEDHCurrentUser(params)
}

export const updateCurrentUser = (params = required()) => {
  return isJustGiving()
    ? updateJGCurrentUser(params)
    : updateEDHCurrentUser(params)
}
