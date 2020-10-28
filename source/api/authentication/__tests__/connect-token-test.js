import moxios from 'moxios'
import { connectToken } from '..'
import { updateClient, instance, servicesAPI } from '../../../utils/client'

describe('Authentication | Connect Token', () => {
  describe('EDH', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('throws', () => {
      const test = () => connectToken()
      expect(test).to.throw
    })
  })

  describe('Connect JG Token', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(servicesAPI)
      moxios.install(instance)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(servicesAPI)
      moxios.uninstall(instance)
    })

    it('sends code to connect endpoint', done => {
      connectToken({ code: 'foobar' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/oauth/connect'
        )
        expect(JSON.parse(request.config.data).code).to.eql('foobar')

        done()
      })
    })

    it('throws if no parameters are provided', () => {
      const test = () => connectToken()
      expect(test).to.throw
    })
  })
})
