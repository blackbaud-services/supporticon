import { instance, servicesAPI } from '../../../utils/client'
import { deletePost } from '..'

describe('Delete Post', () => {
  beforeEach(() => {
    moxios.install(instance)
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(instance)
    moxios.uninstall(servicesAPI)
  })

  it('throws if no token is passed', () => {
    const test = () => deletePost({ bogus: 'data' })
    expect(test).to.throw
  })

  it('hits the api with the correct url and data', done => {
    deletePost({
      id: '3210-1234-43210',
      token: 'test-token'
    })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      const headers = request.config.headers

      expect(request.url).to.contain(
        '/v1/justgiving/graphql'
      )
      expect(headers.Authorization).to.equal('Bearer test-token')
      done()
    })
  })
})
