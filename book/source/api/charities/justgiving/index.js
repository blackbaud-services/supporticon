import { get } from '../../../utils/client'
import { required, paramsSerializer, isURL } from '../../../utils/params'
import { baseUrl } from '../../../utils/justgiving'

export const c = {
  CAMPAIGN_SEARCH_ENDPOINT: 'v1/campaign/autocomplete',
  ENDPOINT: 'v1/charity',
  SEARCH_ENDPOINT: 'v1/onesearch'
}

export const fetchCharities = (params = required()) =>
  Promise.reject('This method is not supported for JustGiving')

export const fetchCharity = (id = required()) => get(`${c.ENDPOINT}/${id}`)

export const searchCharities = (params = required()) => {
  if (params.campaign) {
    const finalParams = {
      ...params,
      field: 'charityNameSuggest',
      includeFuzzySearch: true,
      maxResults: params.limit,
      campaignGuid: params.campaign
    }

    return get(
      c.CAMPAIGN_SEARCH_ENDPOINT,
      finalParams,
      {},
      { paramsSerializer }
    )
  } else {
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
}

export const deserializeCharity = charity => {
  const id = charity.id || charity.Id

  return {
    active: true,
    categories: charity.categories,
    country: charity.countryCode || charity.CountryCode,
    description: charity.description || charity.Description,
    donateUrl: `${baseUrl()}/onecheckout/donation/direct/${id}`,
    email: charity.emailAddress,
    events: charity.EventIds,
    getStartedUrl: `${baseUrl()}/fundraising-page/creation/?cid=${id}`,
    id,
    logo:
      charity.logoAbsoluteUrl ||
      (isURL(charity.Logo)
        ? charity.Logo
        : `${baseUrl('images')}/image/${charity.Logo}`),
    name: charity.displayName || charity.name || charity.Name,
    registrationNumber: charity.registrationNumber,
    slug:
      charity.pageShortName || (charity.Link && charity.Link.split('/').pop()),
    url: charity.profilePageUrl
  }
}
