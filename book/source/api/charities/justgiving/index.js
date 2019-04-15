import { get, isStaging } from '../../../utils/client'
import { required } from '../../../utils/params'

export const c = {
  ENDPOINT: 'v1/charity',
  SEARCH_ENDPOINT: 'v1/onesearch'
}

export const fetchCharities = (params = required()) =>
  Promise.reject('This method is not supported for JustGiving')

export const fetchCharity = (id = required()) => get(`${c.ENDPOINT}/${id}`)

export const searchCharities = (params = required()) => {
  const finalParams = {
    ...params,
    i: 'Charity'
  }

  return get(c.SEARCH_ENDPOINT, finalParams).then(
    response =>
      (response.GroupedResults &&
        response.GroupedResults.length &&
        response.GroupedResults[0].Results) ||
      []
  )
}

export const deserializeCharity = charity => {
  const id = charity.id || charity.Id
  const subdomain = isStaging() ? 'www.staging' : 'www'

  return {
    active: true,
    categories: charity.categories,
    country: charity.countryCode || charity.CountryCode,
    description: charity.description || charity.Description,
    donateUrl: `https://${subdomain}.justgiving.com/onecheckout/donation/direct/${id}`,
    email: charity.emailAddress,
    events: charity.EventIds,
    getStartedUrl: `https://${subdomain}.justgiving.com/fundraising-page/creation/?cid=${id}`,
    id: charity.id || charity.Id,
    logo: charity.logoAbsoluteUrl || charity.Logo,
    name: charity.name || charity.Name,
    registrationNumber: charity.registrationNumber,
    slug: charity.pageShortName || charity.Link.split('/').pop(),
    url: charity.profilePageUrl
  }
}
