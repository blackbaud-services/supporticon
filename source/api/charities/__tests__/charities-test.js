import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { fetchCharities, fetchCharity, searchCharities } from '..'

describe('Search charities', () => {
  describe('in everydayhero', () => {
    beforeEach(() => moxios.install(instance))
    afterEach(() => moxios.uninstall(instance))

    it('fetches charities using the provided params', done => {
      fetchCharities({ campaign: 'au-123' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/charities'
        )
        expect(request.url).to.contain('campaign_ids=au-123')
        done()
      })
    })

    it('throws if charities are requested, but no parameters are provided', () => {
      const test = () => fetchCharities()
      expect(test).to.throw
    })

    describe('fetches a single charity', () => {
      it('when an id is passed', done => {
        fetchCharity('au-123')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://everydayhero.com/api/v2/charities/au-123'
          )
          done()
        })
      })

      it('when an object is passed', done => {
        fetchCharity({
          countryCode: 'au',
          slug: 'test-charity'
        })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://everydayhero.com/api/v2/charities/au/test-charity'
          )
          done()
        })
      })
    })

    it('throws if a charity is requested, but no charity id is supplied', () => {
      const test = () => fetchCharity()
      expect(test).to.throw
    })

    it('searches charities using the provided params', done => {
      searchCharities({ campaign: 'au-0', q: 'foo' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/charities'
        )
        expect(request.url).to.contain('campaign_id=au-0')
        expect(request.url).to.contain('q=foo')
        done()
      })
    })
  })

  describe('in justgiving', () => {
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

    it('throws if charities are requested', () => {
      const test = () => fetchCharities({ campaign: 'my-campaign' })
      expect(test).to.throw
    })

    it('fetches a single charity', done => {
      fetchCharity('12345')
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.justgiving.com/v1/charity/12345'
        )
        done()
      })
    })

    it('throws if a charity is requested, but no charity id is supplied', () => {
      const test = () => fetchCharity()
      expect(test).to.throw
    })

    it('searches charities', done => {
      searchCharities({ q: 'foo' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/onesearch'
        )
        expect(request.url).to.contain('i=Charity')
        expect(request.url).to.contain('q=foo')
        done()
      })
    })
  })
})
