import { get, put } from '../../../utils/client'
import { required } from '../../../utils/params'

export const resetPassword = ({
  email = required()
}) => (
  get(`v1/account/${email}/requestpasswordreminder`)
)

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
    userId: data.userId,
    token,
    name: [data.firstName, data.lastName].join(' '),
    email: data.email,
    address: data.address
  }))
}

export const signUp = ({
  firstName = required(),
  lastName = required(),
  email = required(),
  password = required(),
  title = required(),
  address = required(),
  reference,
  cause
}) => (
  put('v1/account', {
    acceptTermsAndConditions: true,
    firstName,
    lastName,
    email,
    password,
    title,
    address,
    reference,
    causeId: cause
  }).then((data) => {
    const { btoa } = window
    const token = btoa(`${email}:${password}`)

    return {
      userId: data.userId,
      token,
      name: [data.firstName, data.lastName].join(' '),
      email: data.email,
      address: data.address
    }
  })
)
