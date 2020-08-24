import moxios from 'moxios'
import { instance, servicesAPI, updateClient } from '../../../utils/client'
import { deletePost } from '..'

describe('Delete Post', () => {
  describe('Delete EDH Post', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('throws if no token is passed', () => {
      const test = () => deletePost({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the api with the correct url and data', done => {
      deletePost({ id: 123, token: 'token' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const headers = request.config.headers

        expect(request.url).to.equal(
          'https://everydayhero.com/api/v2/posts/123'
        )
        expect(headers.Authorization).to.equal('Bearer token')
        done()
      })
    })
  })

  describe('Delete JG post', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(instance)
      moxios.install(servicesAPI)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
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
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        expect(headers.Authorization).to.equal('Bearer test-token')
        done()
      })
    })
  })
})
