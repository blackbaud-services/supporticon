import { metadataAPI } from '../../../utils/client'
import { required } from '../../../utils/params'
import keys from 'lodash/keys'

export const fetchMetadata = ({
  app = required(),
  token = required(),
  id,
  authType = 'Basic'
}) =>
  metadataAPI
    .get(`/v1/apps/${app}/metadata`, {
      params: { page: id },
      headers: { Authorization: [authType, token].join(' ') }
    })
    .then(response => response.data)

export const createMetadata = ({
  app = required(),
  token = required(),
  id = required(),
  metadata = required(),
  authType = 'Basic'
}) => {
  const headers = { Authorization: [authType, token].join(' ') }
  const values = keys(metadata).map(key => ({ key, value: metadata[key] }))

  return metadataAPI
    .post(`/v1/apps/${app}/metadata`, { page: id, values }, { headers })
    .then(response => response.data)
}

export const updateMetadata = ({
  app = required(),
  token = required(),
  id = required(),
  key = required(),
  value = required(),
  authType = 'Basic'
}) =>
  metadataAPI
    .put(
      `/v1/apps/${app}/metadata/${id}`,
      { key, value },
      { headers: { Authorization: [authType, token].join(' ') } }
    )
    .then(response => response.data)
