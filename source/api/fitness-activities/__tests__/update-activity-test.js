import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { updateFitnessActivity } from '..'

describe('Update Fitness Activity', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Update EDH fitness activity', () => {
    it('throws if no id is passed', () => {
      const test = () => updateFitnessActivity({ token: '12345678' })
      expect(test).to.throw
    })

    it('throws if no token is passed', () => {
      const test = () => updateFitnessActivity(1234, { bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      updateFitnessActivity(123, {
        token: '012345abcdef',
        type: 'sport',
        duration: 60
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/fitness_activities/123?access_token=012345abcdef'
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

      updateFitnessActivity(1234, {
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

  describe('Update JG fitness activity', () => {
    beforeEach(() => {
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    it('is not supported', () => {
      const test = () =>
        updateFitnessActivity(123, {
          token: 'token',
          type: 'sport',
          duration: 10
        })

      expect(test).to.throw
    })
  })
})
