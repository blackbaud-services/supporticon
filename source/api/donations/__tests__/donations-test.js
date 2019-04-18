import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { fetchDonation, replyToDonation } from '..'

describe('Donations', () => {
  describe('EDH Donations', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    describe('Fetch EDH Donation', () => {
      it('is not supported', () => {
        const test = () => fetchDonation('donation-id')
        expect(test).to.throw
      })
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
  })

  describe('JG donations', () => {
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

    describe('Fetch JG Donation', () => {
      it('uses the correct url to fetch a single donation', done => {
        fetchDonation('donation-id')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://api.justgiving.com/v1/donation/donation-id'
          )
          done()
        })
      })

      it('throws if no id is passed in', () => {
        const test = () => fetchDonation()
        expect(test).to.throw
      })
    })

    describe('Reply to JG Donation', () => {
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
})
