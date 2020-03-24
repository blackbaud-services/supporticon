import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { createFitnessActivity } from '..'

describe('Create Fitness Activity', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Create EDH fitness activity', () => {
    it('throws if no token is passed', () => {
      const test = () => createFitnessActivity({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      createFitnessActivity({
        token: '012345abcdef',
        type: 'sport',
        duration: 60
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/fitness_activities?access_token=012345abcdef'
        )
        done()
      })
    })

    it('returns the expected params', done => {
      const response = {
        campaign_uid: '1234',
        name: 'Super Supporter',
        birthday: '1970-01-02'
      }

      createFitnessActivity({
        token: '012345abcdef',
        type: 'sport',
        duration: 60
      }).then(activity => {
        expect(activity).to.equal(response)
        done()
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({ response })
      })
    })
  })

  describe('Create JG fitness activity', () => {
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

    it('throws with missing required params', () => {
      const test = () => createFitnessActivity({ distance: 123 })
      expect(test).to.throw
    })

    it('hits the JG api with the correct url and data', done => {
      createFitnessActivity({
        token: '012345abcdef',
        pageSlug: 'my-page',
        type: 'walk',
        duration: 60
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://api.justgiving.com/v1/fitness')
        done()
      })
    })
  })
})
