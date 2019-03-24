import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { fetchDonationTotals } from '..'

import {
  fetchDonationTotals as fetchEDHDonationTotals,
  deserializeDonationTotals as deserializeEDHTotals
} from '../everydayhero'

import {
  fetchDonationTotals as fetchJGDonationTotals,
  deserializeDonationTotals as deserializeJGTotals
} from '../justgiving'

describe('Fetch Donation Totals', () => {
  it('throws if no params are passed in', () => {
    const test = () => fetchDonationTotals()
    expect(test).to.throw
  })

  describe('Fetch EDH Donation Totals', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('uses the correct url to fetch totals for a campaign', done => {
      fetchEDHDonationTotals({ campaign_id: 'au-6839' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/totals'
        )
        expect(request.url).to.contain('campaign_id=au-6839')
        done()
      })
    })

    it('uses the correct url to fetch totals for a charity', done => {
      fetchEDHDonationTotals({ charity_id: 'au-28' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/search/totals'
        )
        expect(request.url).to.contain('charity_id=au-28')
        done()
      })
    })
  })

  describe('Fetch JG Donation Totals', () => {
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

    it('uses the correct url to fetch totals for an event', done => {
      fetchJGDonationTotals({ event: 12345 })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.justgiving.com/v1/event/12345/leaderboard?currency=GBP'
        )
        done()
      })
    })

    it('allows the country (and currency) to be specified', done => {
      fetchJGDonationTotals({ event: 12345, country: 'ie' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.justgiving.com/v1/event/12345/leaderboard?currency=EUR'
        )
        done()
      })
    })

    it('uses the correct url to fetch totals for a campaign', done => {
      fetchJGDonationTotals({ campaign: 'my-campaign' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.justgiving.com/campaigns/v2/campaign/my-campaign'
        )
        done()
      })
    })
  })
})

describe('Deserialize donation totals', () => {
  describe('Deserialize EDH donation totals', () => {
    it('Defaults falsy donation sums to 0', () => {
      const deserializedDonationTotals = deserializeEDHTotals({
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

  describe('Deserialize JG donation totals', () => {
    it('Defaults falsy donation sums to 0', () => {
      const deserializedDonationTotals = deserializeJGTotals({
        totalRaised: 0
      })

      expect(deserializedDonationTotals).to.deep.equal({
        raised: 0,
        donations: 0
      })
    })
  })
})
