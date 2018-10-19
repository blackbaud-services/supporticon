import { get } from '../../../utils/client'
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

export const deserializeCharity = charity => ({
  active: true,
  categories: charity.categories,
  country: charity.countryCode || charity.CountryCode,
  description: charity.description || charity.Description,
  email: charity.emailAddress,
  events: charity.EventIds,
  id: charity.id || charity.Id,
  logo: charity.logoAbsoluteUrl || charity.Logo,
  name: charity.name || charity.Name,
  slug: charity.pageShortName || charity.Link.split('/').pop()
})
