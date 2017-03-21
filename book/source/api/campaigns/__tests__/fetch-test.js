import moxios from 'moxios'
import { instance } from '../../../utils/fetch'
import * as actions from '../../../utils/actions'

import {
  fetchCampaigns,
  fetchCampaign,
  fetchCampaignGroups
} from '..'

describe ('Fetch Campaigns', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('fetches campaigns using the provided params', (done) => {
    fetchCampaigns({ charity: 'au-28' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
      expect(request.url).to.contain('charity_ids=au-28')
      done()
    })
  })

  it ('fetches campaigns for multiple charities', (done) => {
    fetchCampaigns({ charity: ['au-28', 'au-29'] })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
      expect(request.url).to.contain('charity_ids=au-28,au-29')
      done()
    })
  })

  it ('throws if campaigns are requested, but no parameters are provided', () => {
    const test = () => fetchCampaigns()
    expect(test).to.throw
  })

  it ('fetches a single campaign', (done) => {
    fetchCampaign('au-6839')
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal('https://everydayhero.com/api/v2/campaigns/au-6839')
      done()
    })
  })

  it ('throws if a campaign is requested, but no campaign id is supplied', () => {
    const test = () => fetchCampaign()
    expect(test).to.throw
  })

  it ('fetches a campaign\'s groups', (done) => {
    fetchCampaignGroups('au-6839')
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal('https://everydayhero.com/api/v2/campaigns/au-6839/groups')
      done()
    })
  })

  it ('throws campaign groups are requested, but no campaign id is supplied', () => {
    const test = () => fetchCampaignGroups()
    expect(test).to.throw
  })
})
