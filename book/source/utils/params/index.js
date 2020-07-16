import keys from 'lodash/keys'

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

export const dataSource = ({ event, charity, campaign }) => {
  if (!isEmpty(event)) {
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

export const isEqual = (a, b) => String(a) === String(b)

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
    var [key, val] = part.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(val)
    return params
  }, {})
}
