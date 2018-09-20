import moxios from 'moxios'
import { fetchPages, fetchPage } from '..'
import { instance, updateClient } from '../../../utils/client'

describe('Fetch Pages', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Fetch EDH Pages', () => {
    describe('Fetch many pages', () => {
      it('uses the correct url to fetch pages', done => {
        fetchPages({ campaign_id: 'au-6839' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://everydayhero.com/api/v2/search/pages'
          )
          expect(request.url).to.contain('campaign_id=au-6839')
          done()
        })
      })

      it('uses a different endpoint if an `allPages` param is passed', done => {
        fetchPages({ campaign_id: 'au-6839', allPages: true })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://everydayhero.com/api/v2/pages'
          )
          expect(request.url).to.contain('campaign_id=au-6839')
          done()
        })
      })

      it('throws if no params are passed in', () => {
        const test = () => fetchPages()
        expect(test).to.throw
      })
    })

    describe('Fetch a single page', () => {
      describe('uses the correct url to fetch a single page', () => {
        it('when an id is passed', done => {
          fetchPage('1234')
          moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            expect(request.url).to.contain(
              'https://everydayhero.com/api/v2/pages'
            )
            expect(request.url).to.contain('1234')
            done()
          })
        })

        it('when an object is passed', done => {
          fetchPage({
            campaignSlug: 'my-campaign',
            countryCode: 'au',
            slug: 'my-page'
          })
          moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            expect(request.url).to.contain(
              'https://everydayhero.com/api/v3/prerelease/pages/au'
            )
            expect(request.url).to.contain('my-campaign')
            expect(request.url).to.contain('my-page')
            done()
          })
        })
      })

      it('throws if no id is passed in', () => {
        const test = () => fetchPage()
        expect(test).to.throw
      })

      it('throws if an incorrect object is passed', () => {
        const test = () => fetchPage({ slug: 'my-page' })
        expect(test).to.throw
      })
    })
  })

  describe('Fetch JG Pages', () => {
    beforeEach(() => {
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    describe('Fetch many pages', () => {
      it('uses the correct url to fetch pages', done => {
        fetchPages({ campaign: 'CAMPAIGN_ID' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/v1/onesearch'
          )
          expect(request.url).to.contain('campaignId=CAMPAIGN_ID')
          done()
        })
      })

      it('uses the uid name as the param when an object is supplied', done => {
        fetchPages({ campaign: { uid: 'UID', shortName: 'SHORT_NAME' } })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/v1/onesearch'
          )
          expect(request.url).to.contain('campaignId=UID')
          done()
        })
      })

      it('throws if no params are passed in', () => {
        const test = () => fetchPages()
        expect(test).to.throw
      })
    })

    describe('Fetch a single page', () => {
      it('uses the correct url to fetch a single page', done => {
        fetchPage('my-page-shortname')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://api.justgiving.com/v1/fundraising/pages/my-page-shortname'
          )
          done()
        })
      })

      it('uses an alternate url to fetch a page by id', done => {
        fetchPage('123')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://api.justgiving.com/v1/fundraising/pagebyid/123'
          )
          done()
        })
      })

      it('throws if no id is passed in', () => {
        const test = () => fetchPage()
        expect(test).to.throw
      })
    })
  })
})
