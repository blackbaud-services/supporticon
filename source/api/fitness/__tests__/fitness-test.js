import moxios from 'moxios'
import { disconnectFitness } from '..'
import { instance, servicesAPI, updateClient } from '../../../utils/client'

describe('Fitness', () => {
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

  describe('Disconnect fitness', () => {
    it('uses the correct url with JWT', done => {
      disconnectFitness({
        pageId: '1234',
        pageSlug: 'my-page',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        expect(request.config.method).to.eql('post')
        done()
      })
    })

    it('throws if no token is passed', () => {
      const test = () => disconnectFitness({ bogus: 'data' })
      expect(test).to.throw
    })
  })
})
