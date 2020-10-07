import moxios from 'moxios'
import { fetchFitnessLeaderboard } from '..'
import { instance, servicesAPI, updateClient } from '../../../utils/client'

describe('Fetch Fitness Leaderboards', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('for EDH', () => {
    it('uses the correct url to fetch a leaderboard', done => {
      fetchFitnessLeaderboard({
        campaign_id: 'au-6839',
        group_value: 'group123'
      })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('campaign_id=au-6839')
        expect(request.url).to.contain('group_value=group123')
        done()
      })
    })

    it('throws if no params are passed in', () => {
      const test = () => fetchFitnessLeaderboard()
      expect(test).to.throw
    })

    it('uses the correct url to fetch a campaign leaderboard', done => {
      fetchFitnessLeaderboard({ campaign: 'au-6839' })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('campaign_id=au-6839')
        done()
      })
    })

    it('uses the correct url to fetch a leaderboard for multiple campaigns', done => {
      fetchFitnessLeaderboard({ campaign: ['au-6839', 'au-6840'] })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('campaign_id[]=au-6839')
        expect(request.url).to.contain('campaign_id[]=au-6840')
        done()
      })
    })

    it('uses the correct url to fetch a charity leaderboard', done => {
      fetchFitnessLeaderboard({ charity: 'au-28' })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('charity_id=au-28')
        done()
      })
    })

    it('uses the correct url to fetch a leaderboard for multiple campaigns', done => {
      fetchFitnessLeaderboard({ charity: ['au-28', 'au-29'] })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('charity_id[]=au-28')
        expect(request.url).to.contain('charity_id[]=au-29')
        done()
      })
    })

    it('correctly transforms page type params', done => {
      fetchFitnessLeaderboard({ type: 'team' })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('group_by=teams')
        done()
      })
    })

    it('correctly transforms activity type params', done => {
      fetchFitnessLeaderboard({ activity: 'run' })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('type=run')
        done()
      })
    })

    it('fetches leaderboards based on a group', done => {
      fetchFitnessLeaderboard({ type: 'group', groupID: 99 })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities_totals'
        )
        expect(request.url).to.contain('group_by=groups')
        expect(request.url).to.contain('group_id=99')
        done()
      })
    })
  })

  describe('for JG', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(instance)
      moxios.install(servicesAPI)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
      moxios.uninstall(servicesAPI)
    })

    it('throws if no params are passed in', () => {
      const test = () => fetchFitnessLeaderboard()
      expect(test).to.throw
    })

    it('uses the correct url to fetch a leaderboard', done => {
      fetchFitnessLeaderboard({ campaign: '12345', useLegacy: false })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        expect(request.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        expect(data.query).to.contain('campaign_any_distance_12345')
        done()
      })
    })

    it('uses the correct url to fetch a leaderboard for multiple campaigns', done => {
      fetchFitnessLeaderboard({ campaign: ['12345', '98765'], useLegacy: true })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fitness/campaign'
        )
        expect(request.url).to.contain('campaignGuid=12345&campaignGuid=98765')
        done()
      })
    })
  })
})
