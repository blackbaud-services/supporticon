import { get, put } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchCurrentUser = ({
  token = required()
}) => (
  get('v1/account', {}, {}, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
)

export const updateCurrentUser = ({
  token = required(),
  userId = required(),
  email = required(),
  firstName,
  lastName,
  address
}) => (
  put(`v1/account/${userId}`, {
    firstName,
    lastName,
    email,
    address
  }, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
)
