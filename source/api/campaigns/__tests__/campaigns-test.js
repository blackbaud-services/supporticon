import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import { fetchCampaigns, fetchCampaign, fetchCampaignGroups } from '..'

describe('Fetch Campaigns', () => {
  describe('Fetch EDH Campaigns', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('fetches campaigns using the provided params', done => {
      fetchCampaigns({ charity: 'au-28' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/campaigns'
        )
        expect(request.url).to.contain('charity_ids=au-28')
        done()
      })
    })

    it('fetches campaigns for multiple charities', done => {
      fetchCampaigns({ charity: ['au-28', 'au-29'] })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/campaigns'
        )
        expect(request.url).to.contain('charity_ids=au-28,au-29')
        done()
      })
    })

    it('throws if campaigns are requested, but no parameters are provided', () => {
      const test = () => fetchCampaigns()
      expect(test).to.throw
    })

    describe('fetches a single campaign', () => {
      it('when an id is passed', done => {
        fetchCampaign('au-6839')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://everydayhero.com/api/v2/campaigns/au-6839'
          )
          done()
        })
      })

      it('when an object is passed', done => {
        fetchCampaign({
          countryCode: 'au',
          slug: 'test-campaign'
        })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://everydayhero.com/api/v2/campaigns/au/test-campaign'
          )
          done()
        })
      })
    })

    it('throws if a campaign is requested, but no campaign id is supplied', () => {
      const test = () => fetchCampaign()
      expect(test).to.throw
    })

    it("fetches a campaign's groups", done => {
      fetchCampaignGroups('au-6839')
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://everydayhero.com/api/v2/campaigns/au-6839/groups'
        )
        done()
      })
    })

    it('throws campaign groups are requested, but no campaign id is supplied', () => {
      const test = () => fetchCampaignGroups()
      expect(test).to.throw
    })
  })

  describe('Fetch JG Campaigns', () => {
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

    it('fetches a single campaign', done => {
      fetchCampaign('my-campaign')
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal(
          'https://api.justgiving.com/campaigns/v2/campaign/my-campaign'
        )
        done()
      })
    })

    it('throws if a campaign is requested, but no campaign id is supplied', () => {
      const test = () => fetchCampaign()
      expect(test).to.throw
    })

    it('throws if multiple campaigns are requested', () => {
      const test = () => fetchCampaigns({ charity: 'foo' })
      expect(test).to.throw
    })

    it('throws if campaign groups are requested', () => {
      const test = () => fetchCampaignGroups('my-campaign')
      expect(test).to.throw
    })
  })
})
