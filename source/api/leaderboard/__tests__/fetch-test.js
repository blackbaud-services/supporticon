import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { fetchLeaderboard } from '..'
import { fetchLeaderboard as fetchJGLeaderboard } from '../justgiving'
import { fetchLeaderboard as fetchEDHLeaderboard } from '../everydayhero'

describe ('Fetch Leaderboards', () => {
  it ('throws if no params are passed in', () => {
    const test = () => fetchLeaderboard()
    expect(test).to.throw
  })

  describe ('Fetch EDH Leaderboards', () => {
    beforeEach (() => {
      moxios.install(instance)
    })

    afterEach (() => {
      moxios.uninstall(instance)
    })

    it ('uses the correct url to fetch a leaderboard', (done) => {
      fetchEDHLeaderboard({ campaign_id: 'au-6839', group_value: 'group123' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
        expect(request.url).to.contain('campaign_id=au-6839')
        expect(request.url).to.contain('group_value=group123')
        done()
      })
    })

    it ('throws if no params are passed in', () => {
      const test = () => fetchEDHLeaderboard()
      expect(test).to.throw
    })

    it ('uses the correct url to fetch a campaign leaderboard', (done) => {
      fetchEDHLeaderboard({ campaign: 'au-6839' })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
        expect(request.url).to.contain('campaign_id=au-6839')
        done()
      })
    })

    it ('uses the correct url to fetch a leaderboard for multiple campaigns', (done) => {
      fetchEDHLeaderboard({ campaign: ['au-6839', 'au-6840']})
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
        expect(request.url).to.contain('campaign_id[]=au-6839')
        expect(request.url).to.contain('campaign_id[]=au-6840')
        done()
      })
    })

    it ('uses the correct url to fetch a charity leaderboard', (done) => {
      fetchEDHLeaderboard({ charity: 'au-28' })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
        expect(request.url).to.contain('charity_id=au-28')
        done()
      })
    })

    it ('uses the correct url to fetch a leaderboard for multiple campaigns', (done) => {
      fetchEDHLeaderboard({ charity: ['au-28', 'au-29'] })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
        expect(request.url).to.contain('charity_id[]=au-28')
        expect(request.url).to.contain('charity_id[]=au-29')
        done()
      })
    })

    it ('correctly transforms page type params', (done) => {
      fetchEDHLeaderboard({ type: 'team' })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages_total')
        expect(request.url).to.contain('group_by=teams')
        done()
      })
    })
  })

  describe ('Fetch JG Leaderboards', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('throws if no params are passed in', () => {
      const test = () => fetchJGLeaderboard()
      expect(test).to.throw
    })

    it ('uses the correct url to fetch a campaign leaderboard', (done) => {
      fetchJGLeaderboard({ charity: 'my-charity', campaign: 'my-campaign' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://api.justgiving.com/v1/campaigns/my-charity/my-campaign/pages')
        expect(request.url).to.contain('pageSize=100')
        done()
      })
    })

    it ('uses the correct url to fetch an event leaderboard', (done) => {
      fetchJGLeaderboard({ event: 12345 })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal('https://api.justgiving.com/v1/event/12345/leaderboard')
        done()
      })
    })

    it ('throws if incorrect params are passed in for an event leaderboard', () => {
      const test = () => fetchJGLeaderboard({ event: 'my-event' })
      expect(test).to.throw
    })

    it ('uses the correct url to fetch a charity leaderboard', (done) => {
      fetchJGLeaderboard({ charity: 4567 })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal('https://api.justgiving.com/v1/charity/4567/leaderboard')
        done()
      })
    })

    it ('throws if incorrect params are passed in for a charity leaderboard', () => {
      const test = () => fetchJGLeaderboard({ charity: 'my-charity' })
      expect(test).to.throw
    })
  })
})
