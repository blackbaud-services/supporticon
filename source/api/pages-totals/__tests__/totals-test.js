import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { fetchPagesTotals } from '..'
import { fetchPagesTotals as fetchEDHPagesTotals } from '../everydayhero'
import { fetchPagesTotals as fetchJGPagesTotals } from '../justgiving'

describe ('Fetch Pages Totals', () => {
  it ('throws if no params are passed in', () => {
    const test = () => fetchPagesTotals()
    expect(test).to.throw
  })

  describe ('Fetch EDH Pages Totals', () => {
    beforeEach (() => {
      moxios.install(instance)
    })

    afterEach (() => {
      moxios.uninstall(instance)
    })

    it ('uses the correct url to fetch totals for a campaign', (done) => {
      fetchEDHPagesTotals({ campaign_id: 'au-6839' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/pages')
        expect(request.url).to.contain('campaign_id=au-6839')
        done()
      })
    })

    it ('uses the correct url to fetch totals for a charity', (done) => {
      fetchEDHPagesTotals({ charity_id: 'au-28' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/pages')
        expect(request.url).to.contain('charity_id=au-28')
        done()
      })
    })
  })

  describe ('Fetch JG Pages Totals', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('uses the correct url to fetch totals for an event', (done) => {
      fetchJGPagesTotals({ event: 12345 })
      moxios.wait(function () {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.equal('https://api.justgiving.com/v1/event/12345/pages')
        done()
      })
    })
  })
})
