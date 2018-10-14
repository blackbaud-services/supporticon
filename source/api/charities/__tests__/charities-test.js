import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { searchCharities } from '..'

describe('Search charities', () => {
  describe('in everydayhero', () => {
    beforeEach(() => moxios.install(instance))
    afterEach(() => moxios.uninstall(instance))

    it ('searches charities using the provided params', done => {
      searchCharities({ campaign: 'au-0', q: 'foo' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/charities')
        expect(request.url).to.contain('campaign_id=au-0')
        expect(request.url).to.contain('q=foo')
        done()
      })
    })
  })

  describe('in justgiving', () => {
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

    it ('searches charities', done => {
      searchCharities({ q: 'foo' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://api.justgiving.com/v1/onesearch')
        expect(request.url).to.contain('i=Charity')
        expect(request.url).to.contain('q=foo')
        done()
      })
    })
  })
})
