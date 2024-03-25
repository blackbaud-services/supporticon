import { instance, servicesAPI } from '../../../utils/client'
import { fetchPosts } from '..'

describe('Fetch Posts', () => {
  beforeEach(() => {
    moxios.install(instance)
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(instance)
    moxios.uninstall(servicesAPI)
  })

  it('hits the api with the correct url and data', done => {
    fetchPosts({ slug: 'my-page' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      const data = JSON.parse(request.config.data)
      const headers = request.config.headers

      expect(request.url).to.contain(
        '/v1/justgiving/graphql'
      )
      done()
    })
  })
})
