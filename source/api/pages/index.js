import fetch from '../../utils/fetch'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/pages',
  NAMESPACE: 'app/pages'
}

/**
* @function deserializer for supporter pages
*/
export const deserializePage = (page) => ({
  id: page.id,
  active: page.active,
  raised: page.amount.cents,
  campaign: page.campaign,
  charity: page.charity,
  expired: page.expired,
  image: page.image.medium_image_url,
  name: page.name,
  target: page.target_cents,
  url: page.url,
  groups: page.page_groups
})

/**
* @function fetches pages from the supporter api
*/
export const fetchPages = (params = required()) => {
  return fetch(c.ENDPOINT, params)
    .then((response) => response.pages)
}
