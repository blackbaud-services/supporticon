import { metadataAPI } from '../../../utils/client'
import { required } from '../../../utils/params'
import keys from 'lodash/keys'

export const deserializeMetadata = ({ id, labels = [], type }) =>
  keys(labels).reduce(
    (keys, key) => ({
      ...keys,
      [key]: { id, value: labels[key], type }
    }),
    {}
  )

export const fetchMetadata = ({
  token = required(),
  id = required(),
  type = 'Page'
}) =>
  metadataAPI
    .get(`/api/v1/metadata`, { params: { token, type, ids: id } })
    .then(response => response.data.metadata)
    .then(data => data[0])

export const createMetadata = ({
  token = required(),
  id = required(),
  metadata = required(),
  type
}) =>
  Promise.all(
    keys(metadata).map(key =>
      updateMetadata({ id, key, value: metadata[key], token, type })
    )
  )

export const updateMetadata = ({
  token = required(),
  id = required(),
  key = required(),
  value = required(),
  type = 'Page'
}) => metadataAPI.post(`/api/v1/metadata`, { id, key, token, type, value })
