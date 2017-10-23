import moxios from 'moxios'
import {
  deserializeDonationTotals,
  fetchDonationTotals
} from '..'
import { instance } from '../../../utils/client'

describe ('Fetch Donation Totals', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('uses the correct url to fetch totals for a campaign', (done) => {
    fetchDonationTotals({ campaign_id: 'au-6839' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/totals')
      expect(request.url).to.contain('campaign_id=au-6839')
      done()
    })
  })

  it ('uses the correct url to fetch totals for a charity', (done) => {
    fetchDonationTotals({ charity_id: 'au-28' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/totals')
      expect(request.url).to.contain('charity_id=au-28')
      done()
    })
  })

  it ('throws if no params are passed in', () => {
    const test = () => fetchDonationTotals()
    expect(test).to.throw
  })
})

describe ('Deserialize donation totals', () => {
  it ('Defaults falsy donation sums to 0', () => {
    const deserializedDonationTotals = deserializeDonationTotals({
      total_amount_cents: {
        sum: null,
        count: 0
      }
    })

    expect(deserializedDonationTotals).to.deep.equal({
      raised: 0,
      donations: 0
    })
  })
})
