import { get, post, put } from '../../utils/client'
import { required } from '../../utils/params'

const c = {
  SEARCH_ENDPOINT: 'api/v2/search/pages',
  ENDPOINT: '/api/v2/pages'
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
  return get(c.SEARCH_ENDPOINT, params)
    .then((response) => response.pages)
}

/**
 * @function create page from the supporter api
 */
export const createPage = ({
  token = required(),
  campaignId = required(),
  birthday = required(),
  name,
  target,
  nickname,
  slug,
  image,
  charityId,
  expiresAt,
  fitnessGoal,
  campaignDate,
  groupValues,
  skipNotification,
  inviteToken
}) => {
  return post(`${c.ENDPOINT}?access_token=${token}`, {
    campaign_id: campaignId,
    name,
    target,
    nickname,
    birthday,
    slug,
    image,
    charity_id: charityId,
    expires_at: expiresAt,
    fitness_goal: fitnessGoal,
    campaign_date: campaignDate,
    group_values: groupValues,
    skip_notification: skipNotification,
    token: inviteToken
  })
}

/**
 * @function update page from the supporter api
 */
export const updatePage = (pageId, {
  token = required(),
  name,
  birthday,
  target,
  nickname,
  slug,
  story,
  fitnessGoal,
  groupValues
}) => {
  return put(`${c.ENDPOINT}/${pageId}?access_token=${token}`, {
    name,
    target,
    nickname,
    birthday,
    story,
    slug,
    fitness_goal: fitnessGoal,
    group_values: groupValues
  })
}
