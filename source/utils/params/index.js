import keys from 'lodash/keys'
import { Base64 } from 'js-base64'

export const required = () => {
  throw new Error('Required parameter not supplied')
}

export const isEmpty = val => {
  if (Array.isArray(val)) {
    return val.length === 0
  } else {
    return !val
  }
}

export const dataSource = ({ event, charity, campaign, donationRef }) => {
  if (donationRef) {
    return 'donationRef'
  } else if (!isEmpty(event)) {
    if (isNaN(event) && isNaN(event.uid) && !Array.isArray(event)) {
      throw new Error('Event parameter must be an ID or an array')
    }

    return 'event'
  } else if (!isEmpty(charity) && isEmpty(campaign)) {
    return 'charity'
  } else if (!isEmpty(campaign)) {
    return 'campaign'
  } else {
    return required()
  }
}

export const getUID = data => {
  switch (typeof data) {
    case 'object':
      return Array.isArray(data) ? getUID(data[0]) : data.uid
    default:
      return data
  }
}

export const getShortName = data =>
  typeof data === 'object' ? data.shortName : data

export const paramsSerializer = params =>
  keys(params)
    .map(key => {
      const value = params[key]

      if (!value) return false

      if (Array.isArray(value)) {
        return value.map(val => [key, val].join('=')).join('&')
      }

      return [key, value].join('=')
    })
    .filter(Boolean)
    .join('&')

export const isURL = str => {
  const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
  return urlRegex.test(str)
}

export const isUuid = string => {
  const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-5][0-9a-f]{3}-?[089ab][0-9a-f]{3}-?[0-9a-f]{12}$/i
  return uuidRegex.test(string)
}

export const isEqual = (a, b) => String(a) === String(b)

export const isInArray = (array, id) =>
  array.filter(idx => isEqual(idx, id)).length > 0

export const parseUrlParams = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  const paramsArray = ['search', 'hash']
    .map(param => window.location[param].substring(1))
    .filter(Boolean)
    .join('&')
    .split('&')

  return paramsArray.reduce(function (params, part) {
    const [key, val] = part.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(val)
    return params
  }, {})
}

export const isParamsObject = args => {
  return (
    args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])
  )
}

export const splitOnDelimiter = (param, delimeter = ',') =>
  typeof param === 'string' ? param.split(delimeter) : param

export const formatUrlParams = (params, encode) =>
  Object.keys(params)
    .filter(key => !!params[key])
    .map(
      key => `${key}=${encode ? encodeURIComponent(params[key]) : params[key]}`
    )
    .join('&')

export const base64EncodeParams = params => {
  const result = Object.keys(params)
    .filter(key => !!params[key])
    .reduce((result, key) => ({ ...result, [key]: params[key] }), {})
  return Base64.encode(JSON.stringify(result))
}
