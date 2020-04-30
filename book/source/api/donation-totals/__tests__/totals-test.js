import moxios from 'moxios'
import { instance, servicesAPI, updateClient } from '../../../utils/client'
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
      moxios.install(servicesAPI)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
      moxios.uninstall(servicesAPI)
    })

    it('uses the correct url to fetch totals for an event', done => {
      fetchJGDonationTotals({ event: 12345 })
      moxios.wait(() => {
        const firstRequest = moxios.requests.first()
        const secondRequest = moxios.requests.mostRecent()

        expect(firstRequest.url).to.equal(
          'https://api.blackbaud.services/v1/justgiving/donations?eventId=12345'
        )

        expect(secondRequest.url).to.equal(
          'https://api.justgiving.com/v1/events/leaderboard?eventid=12345&currency=GBP'
        )
        done()
      })
    })

    it('allows the country (and currency) to be specified', done => {
      fetchJGDonationTotals({ event: 12345, country: 'ie' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.justgiving.com/v1/events/leaderboard?eventid=12345&currency=EUR'
        )
        done()
      })
    })

    it('uses the correct url to fetch totals for a campaign', done => {
      fetchJGDonationTotals({ campaign: 'my-campaign' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.blackbaud.services/v1/justgiving/campaigns/my-campaign'
        )
        done()
      })
    })

    it('uses the correct url to fetch totals for multiple campaigns', done => {
      fetchJGDonationTotals({ campaign: ['1234', '5678'] })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.justgiving.com/donationsleaderboards/v1/totals?campaignGuids=1234&campaignGuids=5678&currencyCode=GBP'
        )
        done()
      })
    })

    it('uses the correct url to fetch totals for a charity', done => {
      fetchJGDonationTotals({ charity: 1234 })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.include(
          'https://api.justgiving.com/donationsleaderboards/v1/totals?charityIds=1234'
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
        raisedAmount: 0
      })

      expect(deserializedDonationTotals).to.deep.equal({
        raised: 0,
        offline: 0,
        donations: 0
      })
    })
  })
})
