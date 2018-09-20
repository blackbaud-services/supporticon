import { get, put, post } from '../../../utils/client'
import { required } from '../../../utils/params'

export const resetPassword = ({ email = required() }) =>
  get(`v1/account/${email}/requestpasswordreminder`)

export const signIn = ({
  email = required(),
  password = required()
}) => {
  const { btoa } = window
  const token = btoa(`${email}:${password}`)

  return get('v1/account', {}, {}, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  }).then((data) => ({
    address: data.address,
    email: data.email,
    name: [data.firstName, data.lastName].join(' '),
    token,
    userId: data.userId
  }))
}

export const signUp = ({
  firstName = required(),
  lastName = required(),
  email = required(),
  password = required(),
  address,
  title,
  cause,
  reference
}) => {
  const payload = {
    acceptTermsAndConditions: true,
    firstName,
    lastName,
    email,
    password,
    title,
    address,
    reference,
    causeId: cause
  }

  const request = address
    ? put('v1/account', payload)
    : post('v1/account/lite', payload)

  return request.then(data => ({
    address,
    country: data.country,
    email,
    firstName,
    lastName,
    name: [firstName, lastName].join(' '),
    token: window.btoa(`${email}:${password}`)
  }))
}
