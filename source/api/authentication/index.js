import client from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/authentication',
  NAMESPACE: 'app/authentication'
}

export const resetPassword = ({
  clientId = required(),
  email = required()
}) => {
  return client.post(`${c.ENDPOINT}/reset_password`, {
    client_id: clientId,
    email: email
  })
}
