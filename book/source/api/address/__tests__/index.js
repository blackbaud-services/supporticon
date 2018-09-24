import moxios from 'moxios'
import { searchAddress, getAddressDetails } from '..'
import { instance, updateClient } from '../../../utils/client'

describe('Search Address EDH', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('uses the correct url', done => {
    searchAddress('Foo street')

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero.com/api/v2/addresses'
      )
      expect(request.url).to.contain('q=Foo+street')
      expect(request.url).to.contain('country_code=au')
      done()
    })
  })

  it('uses the correct url for a different region', done => {
    searchAddress('Foo street', 'us')

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero.com/api/v2/addresses'
      )
      expect(request.url).to.contain('q=Foo+street')
      expect(request.url).to.contain('country_code=us')
      done()
    })
  })
})

describe('Get Address Details EDH', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('uses the correct url', done => {
    getAddressDetails(123)

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero.com/api/v2/addresses/au/123'
      )
      done()
    })
  })

  it('uses the correct url for a different region', done => {
    getAddressDetails(123, 'us')

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero.com/api/v2/addresses/us/123'
      )
      done()
    })
  })
})

describe('Search Address JG', () => {
  beforeEach(() => {
    moxios.install(instance)
    updateClient({ baseURL: 'https://api.justgiving.com' })
  })

  afterEach(() => {
    moxios.uninstall(instance)
    updateClient({ baseURL: 'https://everydayhero.com' })
  })

  it('throws unsupported error', () => {
    const test = () => searchAddress('Foo street')
    expect(test).to.throw
  })
})

describe('Get Address Details JG', () => {
  beforeEach(() => {
    moxios.install(instance)
    updateClient({ baseURL: 'https://api.justgiving.com' })
  })

  afterEach(() => {
    moxios.uninstall(instance)
    updateClient({ baseURL: 'https://everydayhero.com' })
  })

  it('throws unsupported error', () => {
    const test = () => getAddressDetails('Foo street')
    expect(test).to.throw
  })
})
