import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  checkAccountAvailability as checkJGAccountAvailability,
  connectToken as connectJGToken,
  resetPassword as resetJGPassword,
  signIn as loginJGAccount,
  signUp as registerJGAccount
} from './justgiving'

import {
  resetPassword as resetEDHPassword,
  signIn as loginEDHUser,
  signUp as signUpEDHUser
} from './everydayhero'

export const resetPassword = (params = required()) => {
  return isJustGiving() ? resetJGPassword(params) : resetEDHPassword(params)
}

export const signIn = (params = required()) => {
  return isJustGiving() ? loginJGAccount(params) : loginEDHUser(params)
}

export const signUp = (params = required()) => {
  return isJustGiving() ? registerJGAccount(params) : signUpEDHUser(params)
}

export const checkAccountAvailability = (params = required()) => {
  return isJustGiving()
    ? checkJGAccountAvailability(params)
    : () => {
      throw new Error('Method not supported')
    }
}

export const connectToken = (params = required()) => {
  return isJustGiving()
    ? connectJGToken(params)
    : () => {
      throw new Error('Method not supported')
    }
}
