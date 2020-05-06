import moxios from 'moxios'
import {
  fetchPages,
  fetchPage,
  fetchUserPages,
  fetchPageDonationCount
} from '..'
import { instance, servicesAPI, updateClient } from '../../../utils/client'

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

      it('sets the limit on the request', done => {
        fetchPages({ campaign_id: 'au-6839', allPages: true, limit: 50 })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://everydayhero.com/api/v2/pages'
          )
          expect(request.url).to.contain('limit=50')
          done()
        })
      })

      it('throws if no params are passed in', () => {
        const test = () => fetchPages()
        expect(test).to.throw
      })
    })

    describe('Fetch user pages', () => {
      it('uses the correct url to fetch user pages', done => {
        fetchUserPages({ token: 'token', campaign: 'au-1' })

        moxios.wait(() => {
          const meRequest = moxios.requests.at(0)
          meRequest.respondWith({
            status: 200,
            response: {
              user: {
                page_ids: [1, 2]
              }
            }
          })

          moxios.wait(() => {
            const fetchRequest = moxios.requests.at(1)

            expect(meRequest.url).to.contain(
              'https://everydayhero.com/api/v1/me'
            )
            expect(fetchRequest.url).to.contain(
              'https://everydayhero.com/api/v2/pages'
            )
            expect(fetchRequest.url).to.contain('ids=1,2')
            expect(fetchRequest.url).to.contain('campaign_id=au-1')
            done()
          })
        })
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

    describe('Fetch a single page donation count', () => {
      it('uses the correct url to fetch donation count', done => {
        fetchPageDonationCount('1234')

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://everydayhero.com/api/v2/pages/1234'
          )
          done()
        })
      })

      it('throws if no id is passed in', () => {
        const test = () => fetchPageDonationCount()
        expect(test).to.throw
      })
    })
  })

  describe('Fetch JG Pages', () => {
    beforeEach(() => {
      updateClient({ baseURL: 'https://api.justgiving.com' })
      moxios.install(servicesAPI)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(servicesAPI)
    })

    describe('Fetch many pages', () => {
      it('uses the correct url to fetch pages', done => {
        fetchPages({ event: 'EVENT_ID' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/v1/onesearch'
          )
          expect(request.url).to.contain('eventId=EVENT_ID')
          done()
        })
      })

      it('uses the correct url to fetch when campaign is supplied', done => {
        fetchPages({ campaign: 'UID' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.blackbaud.services/v1/justgiving/campaigns'
          )
          expect(request.url).to.contain('UID')
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

      it('uses the correct url to fetch a page by slug if optional param is passed', done => {
        fetchPage(123, true)
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://api.justgiving.com/v1/fundraising/pages/123'
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

      it('fetches pages by event with the correct pageSize', done => {
        fetchPages({ event: '123', allPages: true, limit: 50 })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/v1/event/123/pages'
          )
          expect(request.url).to.contain('pageSize=50')
          done()
        })
      })

      it('throws if no id is passed in', () => {
        const test = () => fetchPage()
        expect(test).to.throw
      })
    })

    describe('Fetch a users pages', () => {
      it('uses the correct url to fetch a single page', done => {
        fetchUserPages({ token: 'token' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://api.justgiving.com/v1/fundraising/pages'
          )
          done()
        })
      })
    })

    describe('Fetch a single page donation count', () => {
      it('uses the correct url to fetch a donation count', done => {
        fetchPageDonationCount('my-page-shortname')

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.equal(
            'https://api.justgiving.com/v1/fundraising/pages/my-page-shortname/donations'
          )
          done()
        })
      })

      it('throws if no id is passed in', () => {
        const test = () => fetchPageDonationCount()
        expect(test).to.throw
      })
    })
  })
})
