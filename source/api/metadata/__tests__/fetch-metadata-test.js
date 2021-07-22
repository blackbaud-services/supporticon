import { metadataAPI } from '../../../utils/client'
import { fetchMetadata } from '..'

describe('Fetching Metadata', () => {
  beforeEach(() => {
    moxios.install(metadataAPI)
  })

  afterEach(() => {
    moxios.uninstall(metadataAPI)
  })

  it('creates metadata with the provided params', done => {
    fetchMetadata({ app: '123', id: '123', token: '123' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://metadata.blackbaud.services/v1/apps/123/metadata'
      )
      done()
    })
  })

  it('throws if required params are not supplied', () => {
    const test = () => fetchMetadata()
    expect(test).to.throw
  })
})
