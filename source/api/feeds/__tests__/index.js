import moxios from 'moxios'
import { fetchDonationFeed } from '..'
import { instance, servicesAPI, updateClient } from '../../../utils/client'

describe('Fetch EDH Donation Feed', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('uses the correct url', done => {
    fetchDonationFeed({ campaign_id: 'au-6839' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero.com/api/v2/search/feed'
      )
      expect(request.url).to.contain('campaign_id=au-6839')
      expect(request.url).to.contain('type[]=OnlineDonation')
      done()
    })
  })

  it('fetches offline donations when includeOffline option is passed in', done => {
    fetchDonationFeed({ campaign_id: 'au-6839', includeOffline: true })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero.com/api/v2/search/feed'
      )
      expect(request.url).to.contain('type[]=OnlineDonation')
      expect(request.url).to.contain('type[]=OfflineDonation')
      done()
    })
  })
})

describe('Fetch JG Donation Feed', () => {
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

  describe('uses the correct url', () => {
    it('for a charity', done => {
      fetchDonationFeed({ charity: '12345' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.blackbaud.services/v1/justgiving/donations?charityId=12345'
        )
        done()
      })
    })

    it('for a page', done => {
      fetchDonationFeed({ page: { shortName: 'test-page' } })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fundraising/pages/test-page/donations'
        )
        expect(request.url).to.contain('pageSize=150')
        done()
      })
    })

    it('for a campaign', done => {
      fetchDonationFeed({ campaign: { uid: '1234-abcd-5678' } })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/donations?campaignGuid=1234-abcd-5678'
        )
        done()
      })
    })

    it('for multiple campaigns', done => {
      fetchDonationFeed({ campaign: ['1234-abcd-5678', 'abcd-1234-9876'] })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/donations'
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
          'https://api.blackbaud.services/v1/justgiving/donations?eventId=1234'
        )
        done()
      })
    })

    it('for multiple events', done => {
      fetchDonationFeed({ event: [{ uid: '1234' }, { uid: '5678' }] })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/donations'
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
          'https://api.blackbaud.services/v1/justgiving/donations'
        )
        expect(request.url).to.contain('eventId=1234')
        expect(request.url).to.contain('campaignGuid=1234-abcd-5678')
        done()
      })
    })
  })
})
