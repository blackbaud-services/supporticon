import get from 'lodash/get'
import * as client from '../../../utils/client'
import { paramsSerializer, required } from '../../../utils/params'

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

export const deserializeFitnessLeaderboard = (item, index) => {
  const subdomain = client.isStaging() ? 'www.staging' : 'www'

  return {
    position: index + 1,
    id: item.ID,
    name: get(item, 'Details.Name'),
    slug: get(item, 'Details.Url'),
    url: `https://${subdomain}.justgiving.com/fundraising/${get(
      item,
      'Details.Url'
    )}`,
    image: `https://images${subdomain.replace(
      'www',
      ''
    )}.jg-cdn.com/image/${get(item, 'Details.ImageId')}`,
    distance: item.TotalValue
  }
}
