import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

/**
* @function deserializer for supporter pages
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
* @function fetches pages from the supporter api
*/
export const fetchPages = (params = required()) => {
  return get('/v1/onesearch', {
    campaignId: params.campaign,
    charityId: params.charity,
    eventId: params.event,
    i: 'Fundraiser',
    ...params
  }).then((response) => (
    response.GroupedResults &&
    response.GroupedResults.length &&
    response.GroupedResults[0].Results
  ))
}

/**
 * @function create page from the supporter api
 */
export const createPage = (params) => {
  return Promise.reject('This method is not supported for JustGiving')
}

/**
 * @function update page from the supporter api
 */
export const updatePage = (pageId, params) => {
  return Promise.reject('This method is not supported for JustGiving')
}
