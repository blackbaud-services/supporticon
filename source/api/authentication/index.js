import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
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
