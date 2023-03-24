import { connectToken } from '..'
import { servicesAPI } from '../../../utils/client'

describe('Authentication | Connect Token', () => {
  beforeEach(() => {
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(servicesAPI)
  })

  it('sends code to connect endpoint', done => {
    connectToken({ code: 'foobar' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      // expect(request.config.baseURL).to.eql('https://api.blackbaud.services')
      expect(['https://api.blackbaud.services', 'https://api-staging.blackbaud.services']).to.include(request.config.baseURL)
      expect(request.url).to.contain('/v1/justgiving/oauth/connect')
      expect(JSON.parse(request.config.data).code).to.eql('foobar')

      done()
    })
  })

  it('throws if no parameters are provided', () => {
    const test = () => connectToken()
    expect(test).to.throw
  })
})
