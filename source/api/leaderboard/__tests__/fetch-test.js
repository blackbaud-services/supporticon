import moxios from 'moxios'
import { fetchLeaderboard } from '..'
import { instance } from '../../../utils/client'

describe ('Fetch Leaderboards', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('uses the correct url to fetch a leaderboard', (done) => {
    fetchLeaderboard({ campaign_id: 'au-6839', group_value: 'group123' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
      expect(request.url).to.contain('campaign_id=au-6839')
      expect(request.url).to.contain('group_value=group123')
      done()
    })
  })

  it ('throws if no params are passed in', () => {
    const test = () => fetchLeaderboard()
    expect(test).to.throw
  })

  it ('uses the correct url to fetch a campaign leaderboard', (done) => {
    fetchLeaderboard({ campaign: 'au-6839' })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
      expect(request.url).to.contain('campaign_id=au-6839')
      done()
    })
  })

  it ('uses the correct url to fetch a leaderboard for multiple campaigns', (done) => {
    fetchLeaderboard({ campaign: ['au-6839', 'au-6840']})
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
      expect(request.url).to.contain('campaign_id[]=au-6839')
      expect(request.url).to.contain('campaign_id[]=au-6840')
      done()
    })
  })

  it ('uses the correct url to fetch a charity leaderboard', (done) => {
    fetchLeaderboard({ charity: 'au-28' })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
      expect(request.url).to.contain('charity_id=au-28')
      done()
    })
  })

  it ('uses the correct url to fetch a leaderboard for multiple campaigns', (done) => {
    fetchLeaderboard({ charity: ['au-28', 'au-29'] })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
      expect(request.url).to.contain('charity_id[]=au-28')
      expect(request.url).to.contain('charity_id[]=au-29')
      done()
    })
  })

  it ('correctly transforms page type params', (done) => {
    fetchLeaderboard({ type: 'team' })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
      expect(request.url).to.contain('group_by=teams')
      done()
    })
  })
})
