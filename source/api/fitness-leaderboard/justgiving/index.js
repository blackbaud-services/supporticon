import get from 'lodash/get'
import * as client from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'
import { baseUrl, imageUrl } from '../../../utils/justgiving'

export const fetchFitnessLeaderboard = (params = required()) => {
  const { campaign = required(), type } = params

  const query = {
    campaignGuid: campaign
  }

  return client
    .get('/v1/fitness/campaign', query, {}, { paramsSerializer })
    .then(result => (type === 'team' ? result.teams : result.pages))
    .then(items => items.filter(item => item.Details))
}

export const deserializeFitnessLeaderboard = (item, index) => ({
  position: index + 1,
  id: item.ID,
  name: get(item, 'Details.Name'),
  slug: get(item, 'Details.Url'),
  url: `${baseUrl()}/fundraising/${get(item, 'Details.Url')}`,
  image:
    imageUrl(get(item, 'Details.ImageId'), 'Size186x186Crop') ||
    'https://assets.blackbaud-sites.com/images/supporticon/user.svg',
  distance: item.TotalValue
})
