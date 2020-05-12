import moxios from 'moxios'
import { instance, servicesAPI, updateClient } from '../../../utils/client'
import { fetchPosts } from '..'

describe('Fetch Posts', () => {
  describe('Fetch EDH posts', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('hits the supporter api with the correct url and data', done => {
      fetchPosts({ page_id: '123456' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/feed'
        )
        expect(request.url).to.contain('page_id=123456')
        expect(request.url).to.contain('type=Post')
        done()
      })
    })
  })

  describe('Fetch JG posts', () => {
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

    it('hits the api with the correct url and data', done => {
      fetchPosts('my-page')

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        const headers = request.config.headers

        expect(request.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        done()
      })
    })
  })
})
