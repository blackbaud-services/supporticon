import moxios from 'moxios'
import { fetchDonationFeed } from '..'
import { instance, updateClient } from '../../../utils/client'

describe ('Fetch EDH Donation Feed', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('uses the correct url', (done) => {
    fetchDonationFeed({ campaign_id: 'au-6839' })
      .then((response) => console.log(response.data))
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/feed')
      expect(request.url).to.contain('campaign_id=au-6839')
      expect(request.url).to.contain('type=OnlineDonation')
      done()
    })
  })
})

describe ('Fetch JG Donation Feed', () => {
  beforeEach (() => {
    moxios.install(instance)
    updateClient({ baseURL: 'https://api.justgiving.com' })
  })

  afterEach (() => {
    moxios.uninstall(instance)
    updateClient({ baseURL: 'https://everydayhero.com' })
  })

  it ('throws unsupported error', () => {
    const test = () => fetchDonationFeed({ campaign: 'au-123' })
    expect(test).to.throw
  })
})
