import moxios from 'moxios'
import { instance } from '../../../utils/fetch'
import * as actions from '../../../utils/actions'

import { fetchDonationTotals } from '..'

describe ('Fetch Donation Totals', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('should use the correct url to fetch totals for a campaign', (done) => {
    fetchDonationTotals({ campaign_id: 'au-6839' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/totals')
      expect(request.url).to.contain('campaign_id=au-6839')
      done()
    })
  })

  it ('should use the correct url to fetch totals for a charity', (done) => {
    fetchDonationTotals({ charity_id: 'au-28' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/search/totals')
      expect(request.url).to.contain('charity_id=au-28')
      done()
    })
  })

  it ('should throw if no params are passed in', () => {
    const test = () => fetchDonationTotals()
    expect(test).to.throw
  })
})
