import { fetchDonationFeed } from '..'
import { servicesAPI } from '../../../utils/client'

describe('Fetch Donation Feed', () => {
  beforeEach(() => {
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(servicesAPI)
  })

  describe('uses the correct url', () => {
    it('for a charity', done => {
      fetchDonationFeed({ charity: '12345' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          '/v1/justgiving/donations?charityId=12345'
        )
        done()
      })
    })

    it('for a page', done => {
      fetchDonationFeed({ page: 123456 })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          '/v1/justgiving/donations?fundraisingPageId=123456'
        )
        done()
      })
    })

    it('for a campaign', done => {
      fetchDonationFeed({ campaign: { uid: '1234-abcd-5678' } })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          '/v1/justgiving/donations?campaignGuid=1234-abcd-5678'
        )
        done()
      })
    })

    it('for multiple campaigns', done => {
      fetchDonationFeed({ campaign: ['1234-abcd-5678', 'abcd-1234-9876'] })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          '/v1/justgiving/donations'
        )
        expect(request.url).to.contain(
          'campaignGuid=1234-abcd-5678,abcd-1234-9876'
        )
        done()
      })
    })

    it('for an event', done => {
      fetchDonationFeed({ event: { uid: '1234' } })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          '/v1/justgiving/donations?eventId=1234'
        )
        done()
      })
    })

    it('for multiple events', done => {
      fetchDonationFeed({ event: [{ uid: '1234' }, { uid: '5678' }] })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          '/v1/justgiving/donations'
        )
        expect(request.url).to.contain('eventId=1234,5678')
        done()
      })
    })

    it('for an event and a campaign', done => {
      fetchDonationFeed({ event: { uid: '1234' }, campaign: '1234-abcd-5678' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          '/v1/justgiving/donations'
        )
        expect(request.url).to.contain('eventId=1234')
        expect(request.url).to.contain('campaignGuid=1234-abcd-5678')
        done()
      })
    })
  })
})
