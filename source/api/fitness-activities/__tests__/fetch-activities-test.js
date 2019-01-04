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
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    it('is not supported', () => {
      const test = () => fetchFitnessActivities({ campaign: 'campaign' })
      expect(test).to.throw
    })
  })
})
