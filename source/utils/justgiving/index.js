import { isStaging, servicesAPI } from '../client'

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
    return JSON.parse(content)[0].nodes[0].ranges[0].text
  }

  return text
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
