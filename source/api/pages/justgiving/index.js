import { get } from '../../../utils/client'
import { getUID, required } from '../../../utils/params'

/**
* @function deserializer for justgiving pages
*/
export const deserializePage = (page) => ({
  active: null,
  campaign: null,
  campaignDate: null,
  charity: null,
  coordinates: null,
  donatationUrl: null,
  expired: null,
  groups: null,
  id: page.Id,
  image: page.Logo,
  name: page.Name,
  raised: page.Amount,
  story: page.ProfileWhy,
  target: page.TargetAmount,
  teamPageId: null,
  url: page.Link,
  uuid: null
})

/**
* @function fetches pages from the justgiving api
*/
export const fetchPages = (params = required()) => {
  const {
    campaign,
    charity,
    event,
    ...args
  } = params

  return get('/v1/onesearch', {
    campaignId: getUID(campaign),
    charityId: getUID(charity),
    eventId: getUID(event),
    i: 'Fundraiser',
    ...args
  }).then((response) => (
    response.GroupedResults &&
    response.GroupedResults.length &&
    response.GroupedResults[0].Results || []
  ))
}

/**
* @function fetches a single page from the justgiving api
*/
export const fetchPage = (page = required()) => {
  return get(`/v1/fundraising/pages/${page}`)
}

/**
 * @function create page using the justgiving api
 */
export const createPage = (params) => {
  return Promise.reject('This method is not supported for JustGiving')
}

/**
 * @function update page using the justgiving api
 */
export const updatePage = (pageId, params) => {
  return Promise.reject('This method is not supported for JustGiving')
}
