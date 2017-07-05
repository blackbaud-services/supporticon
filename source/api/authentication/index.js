import { post } from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/authentication',
  NAMESPACE: 'app/authentication'
}

export const resetPassword = ({
  clientId = required(),
  email = required(),
  reference,
  return_to
}) => {
  return post(`${c.ENDPOINT}/reset_password`, {
    client_id: clientId,
    email,
    reference,
    return_to
  })
}

export const signIn = ({
  clientId = required(),
  email = required(),
  password = required(),
  country = 'au'
}) => {
  return post(`${c.ENDPOINT}/sign_in`, {
    client_id: clientId,
    country,
    user: {
      email,
      password
    }
  })
  .then((data) => ({
    userId: data.user_id,
    token: data.token
  }))
}

export const signUp = ({
  clientId = required(),
  name = required(),
  email = required(),
  password = required(),
  phone = required(),
  country = 'au'
}) => {
  return post(`${c.ENDPOINT}/sign_up`, {
    client_id: clientId,
    country,
    user: {
      name,
      email,
      password,
      phone
    }
  })
  .then((data) => ({
    userId: data.user_id,
    token: data.token
  }))
}
