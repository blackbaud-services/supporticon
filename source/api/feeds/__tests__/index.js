import moxios from 'moxios'
import { fetchDonationFeed } from '..'
import { instance, updateClient } from '../../../utils/client'

describe('Fetch EDH Donation Feed', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('uses the correct url', done => {
    fetchDonationFeed({ campaign_id: 'au-6839' }).then(response =>
      console.log(response.data)
    )
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero.com/api/v2/search/feed'
      )
      expect(request.url).to.contain('campaign_id=au-6839')
      expect(request.url).to.contain('type=OnlineDonation')
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
  })

  afterEach(() => {
    updateClient({ baseURL: 'https://everydayhero.com' })
    moxios.uninstall(instance)
  })

  describe('uses the correct url', () => {
    it('for a charity', done => {
      fetchDonationFeed({ charity: '12345' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.justgiving.com/v1/charity/12345/donations'
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
  })
})
