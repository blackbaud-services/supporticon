import moxios from 'moxios'
import { instance, servicesAPI, updateClient } from '../../../utils/client'
import { deleteFitnessActivity } from '..'

describe('Delete Fitness Activity', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Delete EDH fitness activity', () => {
    it('throws if no token is passed', () => {
      const test = () => deleteFitnessActivity(12345678)
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      deleteFitnessActivity(123, '012345abcdef')

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/fitness_activities/123?access_token=012345abcdef'
        )
        done()
      })
    })

    it('returns the expected params', done => {
      deleteFitnessActivity(1234, '012345abcdef')

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()

        request.respondWith({ status: 204 }).then(response => {
          expect(response.status).to.eql(204)
          done()
        })
      })
    })
  })

  describe('Delete JG fitness activity', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(servicesAPI)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(servicesAPI)
    })

    it('throws if no token is passed', () => {
      const test = () => deleteFitnessActivity({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the api with the correct url and data', done => {
      deleteFitnessActivity('3210-1234-43210', 'test-token')

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const headers = request.config.headers

        expect(request.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        expect(headers.Authorization).to.equal('Bearer test-token')
        done()
      })
    })
  })
})
