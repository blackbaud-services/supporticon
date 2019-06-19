import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { createPost } from '..'

describe('Create Post', () => {
  describe('Create EDH Post', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('throws if no token is passed', () => {
      const test = () => createPost({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      createPost({
        caption: 'Test caption',
        pageId: 'my-page-id',
        token: 'test-token'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        const headers = request.config.headers

        expect(request.url).to.contain('https://everydayhero.com/api/v2/posts')
        expect(headers.Authorization).to.equal('Bearer test-token')
        expect(data.caption).to.equal('Test caption')
        expect(data.page_id).to.equal('my-page-id')
        done()
      })
    })
  })

  describe('Create JG post', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(instance)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it('hits the supporter api with the correct url and data', done => {
      createPost({
        caption: 'Test caption',
        slug: 'my-page',
        token: 'test-token',
        authType: 'Bearer'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        const headers = request.config.headers

        expect(request.url).to.equal(
          'https://api.justgiving.com/v1/fundraising/pages/my-page/updates'
        )
        expect(headers.Authorization).to.equal('Bearer test-token')
        expect(data.Message).to.equal('Test caption')
        done()
      })
    })
  })
})
