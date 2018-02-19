import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  fetchCurrentUser as fetchJGCurrentUser,
  updateCurrentUser as updateJGCurrentUser
} from './justgiving'

import {
  fetchCurrentUser as fetchEDHCurrentUser,
  updateCurrentUser as updateEDHCurrentUser
} from './everydayhero'

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
