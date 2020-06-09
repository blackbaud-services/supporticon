import moxios from 'moxios'
import { instance, servicesAPI, updateClient } from '../../../utils/client'
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
      moxios.install(instance)
      moxios.install(servicesAPI)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
      moxios.uninstall(servicesAPI)
    })

    it('throws with missing required params', () => {
      const test = () => createFitnessActivity({ distance: 123 })
      expect(test).to.throw
    })

    describe('hits the JG api with the correct url and data', () => {
      it('using the consumer API', done => {
        createFitnessActivity({
          token: '012345abcdef',
          pageSlug: 'my-page',
          caption: 'A walk in the park',
          type: 'run',
          distance: 60
        })

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/v1/fitness'
          )
          done()
        })
      })

      it('using the GraphQL API', done => {
        createFitnessActivity({
          token: '012345abcdef',
          pageId: '00000-123456-1234',
          caption: 'A walk in the park',
          type: 'walk',
          duration: 60,
          userId: '123456-00000-1234',
          useTimeline: true
        })

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.blackbaud.services/v1/justgiving/graphql'
          )
          done()
        })
      })
    })
  })
})
