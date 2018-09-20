import { post } from '../../../utils/client'
import { required } from '../../../utils/params'

export const resetPassword = ({
  clientId = required(),
  email = required(),
  reference,
  returnTo
}) =>
  post('api/v2/authentication/reset_password', {
    client_id: clientId,
    email,
    reference,
    return_to: returnTo
  })

export const signIn = ({
  clientId = required(),
  email = required(),
  password = required(),
  country = 'au'
}) =>
  post('api/v2/authentication/sign_in', {
    client_id: clientId,
    country,
    user: {
      email,
      password
    }
  }).then(data => ({
    userId: data.user_id,
    token: data.token
  }))

export const signUp = ({
  clientId = required(),
  name = required(),
  email = required(),
  password = required(),
  phone = required(),
  country = 'au'
}) =>
  post('api/v2/authentication/sign_up', {
    client_id: clientId,
    country,
    user: {
      name,
      email,
      password,
      phone
    }
  }).then(data => ({
    userId: data.user_id,
    token: data.token
  }))
