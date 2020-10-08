import { isStaging, servicesAPI } from '../client'
import get from 'lodash/get'

export const isValidJSON = json => {
  try {
    JSON.parse(json)
    return true
  } catch (error) {
    return false
  }
}

export const parseText = (text = '') => {
  const content = text.replace(/\n/g, ' ')

  if (isValidJSON(content)) {
    return JSON.parse(content)
      .map(parseTextSection)
      .join(' ')
  }

  return text
}

const parseTextSection = (section = {}) => {
  switch (section.type) {
    case 'paragraph':
      return get(section, 'nodes.0.ranges.0.text', '')
    case 'header':
      return get(section, 'text', '')
    default:
      return ''
  }
}

export const baseUrl = (subdomain = 'www') => {
  return `https://${subdomain}${isStaging() ? '.staging' : ''}.justgiving.com`
}

export const imageUrl = (image, template = 'CrowdfundingOwnerAvatar') => {
  return image
    ? `${baseUrl('images')}/image/${image}?template=${template}`
    : null
}

export const apiImageUrl = (slug, template = 'CrowdfundingOwnerAvatar') =>
  `${
    servicesAPI.defaults.baseURL
  }/v1/justgiving/pages/${slug}/image?template=${template}`
