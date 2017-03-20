import moxios from 'moxios'
import { instance } from '../../../utils/fetch'
import * as actions from '../../../utils/actions'

import { fetchCampaigns, fetchCampaign } from '..'

describe ('Fetch Campaigns', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('should use the correct url to fetch campaigns', (done) => {
    fetchCampaigns({ charity: 'au-28' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
      expect(request.url).to.contain('charity_ids=au-28')
      done()
    })
  })

  it ('should map multiple charities correctly to fetch campaigns', (done) => {
    fetchCampaigns({ charity: ['au-28', 'au-29'] })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
      expect(request.url).to.contain('charity_ids=au-28,au-29')
      done()
    })
  })

  it ('should throw if no params are passed in', () => {
    const test = () => fetchCampaigns()
    expect(test).to.throw
  })

  it ('should use the correct url to fetch a campaign', (done) => {
    fetchCampaign('au-6839')
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal('https://everydayhero.com/api/v2/campaigns/au-6839')
      done()
    })
  })

  it ('should throw if no params are passed in', () => {
    const test = () => fetchCampaign()
    expect(test).to.throw
  })
})
