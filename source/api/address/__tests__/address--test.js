import { searchAddress, getAddressDetails } from '..'
import { servicesAPI } from '../../../utils/client'

describe('Addresses', () => {
  beforeEach(() => {
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(servicesAPI)
  })

  describe('Address search', () => {
    it('uses the correct url', done => {
      searchAddress('SW1A1AA')

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        // expect(request.config.baseURL).to.eql('https://api.blackbaud.services')
        expect(['https://api.blackbaud.services', 'https://api-staging.blackbaud.services']).to.include(request.config.baseURL)
        expect(request.url).to.eql(
          '/v1/justgiving/addresses/search/postcode/SW1A1AA'
        )
        done()
      })
    })
  })

  describe('Get Address Details JG', () => {
    it('uses the correct url', done => {
      getAddressDetails('1234')

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql('/v1/justgiving/addresses/1234')
        done()
      })
    })
  })
})
