import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { fetchFitnessActivities } from '..'

describe('Fetch Fitness Activities', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Fetch EDH fitness activities', () => {
    it('throws if no token is passed', () => {
      const test = () => fetchFitnessActivities({ bogus: 'data' })
      expect(test).to.throw
    })

    it('fetches activities using the provided params', done => {
      fetchFitnessActivities({ charity: 'au-28' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/fitness_activities'
        )
        expect(request.url).to.contain('charity_id=au-28')
        done()
      })
    })
  })

  describe('Fetch JG fitness activities', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      return moxios.install(instance)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      return moxios.uninstall(instance)
    })

    it('throws with incorrect params', () => {
      const test = () => fetchFitnessActivities({ charity: 'charity' })
      expect(test).to.throw
    })

    it('fetches activities for a campaign', done => {
      fetchFitnessActivities({ campaign: '12345678' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fitness/campaign'
        )
        expect(request.url).to.contain('campaignGuid=12345678')
        done()
      })
    })

    it('fetches activities for a page', done => {
      fetchFitnessActivities({ page: 'test-page' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fitness/fundraising/test-page'
        )
        done()
      })
    })

    it('fetches activities for a team', done => {
      fetchFitnessActivities({ team: 'test-team' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fitness/teams/test-team'
        )
        done()
      })
    })
  })
})
