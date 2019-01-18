import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { replyToDonation } from '..'

describe('Create Post', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Reply to EDH Donation', () => {
    it('throws if no token is passed', () => {
      const test = () => replyToDonation({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      replyToDonation({
        caption: 'Test reply',
        pageId: 'my-page-id',
        donationId: 'donation-id',
        token: 'test-token'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        const headers = request.config.headers

        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/pages/my-page-id/donations/donation-id/comments'
        )
        expect(headers.Authorization).to.equal('Bearer test-token')
        expect(data.caption).to.equal('Test reply')
        done()
      })
    })
  })

  describe('Reply to JG donation', () => {
    beforeEach(() => {
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    it('is not supported', () => {
      const test = () =>
        replyToDonation({
          caption: 'Hello',
          donationId: 'donation-id',
          pageId: 12345,
          token: 'token'
        })

      expect(test).to.throw
    })
  })
})
