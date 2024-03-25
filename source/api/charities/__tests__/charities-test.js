import { instance } from '../../../utils/client'
import { fetchCharity, searchCharities } from '..'

describe('Search charities', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('fetches a single charity', done => {
    fetchCharity('12345')
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal(
        '/v1/charity/12345'
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
      expect(request.url).to.contain('/v1/onesearch')
      expect(request.url).to.contain('i=Charity')
      expect(request.url).to.contain('q=foo')
      done()
    })
  })

  it('searches charities within a campaign', done => {
    searchCharities({ q: 'foo', campaign: 'test' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        '/v1/campaign/autocomplete'
      )
      expect(request.url).to.contain('campaignGuid=test')
      expect(request.url).to.contain('q=foo')
      done()
    })
  })
})
