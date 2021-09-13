import { instance } from '../../../utils/client'
import { createPage } from '..'

describe('Create Page', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('hits the justgiving api with the correct url and data', done => {
    createPage({
      token: '012345abcdef',
      charityId: '1234',
      slug: 'super-supporter',
      title: 'Super Supporter',
      charityOptIn: true
    })

    moxios.wait(() => {
      const shortNameRequest = moxios.requests.mostRecent()

      shortNameRequest.respondWith({
        status: 200,
        response: { Names: ['super-supporter-2'] }
      })

      expect(shortNameRequest.url).to.eql(
        '/v1/fundraising/pages/suggest?preferredName=super-supporter'
      )

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          '/v1/fundraising/pages'
        )
        expect(request.config.headers['Authorization']).to.eql(
          'Basic 012345abcdef'
        )
        expect(JSON.parse(request.config.data).pageShortName).to.eql(
          'super-supporter-2'
        )
        expect(JSON.parse(request.config.data).pageTitle).to.eql(
          'Super Supporter'
        )
        done()
      })
    })
  })

  it('throws if no token is passed', () => {
    const test = () => createPage({ bogus: 'data' })
    expect(test).to.throw
  })
})
