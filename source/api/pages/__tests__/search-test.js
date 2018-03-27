import moxios from 'moxios'
import { searchPages } from '..'
import { instance, updateClient } from '../../../utils/client'

describe ('Search Pages', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  describe ('Search EDH Pages', () => {
    it ('uses the correct url to fetch pages', (done) => {
      searchPages({ campaign_id: 'au-6839' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/search/pages')
        expect(request.url).to.contain('campaign_id=au-6839')
        done()
      })
    })

    it ('throws if no params are passed in', () => {
      const test = () => searchPages()
      expect(test).to.throw
    })
  })

  describe ('Search JG Pages', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com' })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('uses the correct url to fetch pages', (done) => {
      searchPages({ campaign: 'CAMPAIGN_ID' })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://api.justgiving.com/v1/onesearch')
        expect(request.url).to.contain('campaignId=CAMPAIGN_ID')
        done()
      })
    })

    it ('uses the uid name as the param when an object is supplied', (done) => {
      searchPages({ campaign: { uid: 'UID', shortName: 'SHORT_NAME' } })
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://api.justgiving.com/v1/onesearch')
        expect(request.url).to.contain('campaignId=UID')
        done()
      })
    })

    it ('throws if no params are passed in', () => {
      const test = () => searchPages()
      expect(test).to.throw
    })
  })
})
