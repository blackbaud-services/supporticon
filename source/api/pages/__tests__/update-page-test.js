import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { updatePage } from '..'

describe('Page | Update Page', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Update EDH Page', () => {
    it('throws if no token is passed', () => {
      const test = () =>
        updatePage(123, {
          bogus: 'data'
        })
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      updatePage(123, {
        token: '012345abcdef',
        campaignId: '1234',
        name: 'Super Supporter',
        birthday: '1970-01-02'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/pages/123?access_token=012345abcdef'
        )
        done()
      })
    })

    it('returns the expected params', done => {
      const response = {
        campaign_uid: '1234',
        name: 'Super Supporter',
        birthday: '1970-01-02'
      }

      updatePage(123, {
        token: '012345abcdef',
        campaignId: '1234',
        name: 'Super Supporter',
        birthday: '1970-01-02'
      }).then(page => {
        expect(page).to.equal(response)
        done()
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          response: {
            page: response
          }
        })
      })
    })
  })

  describe('Update JG Page', () => {
    beforeEach(() => {
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    it('updates the page story correct url and data', done => {
      updatePage('fundraising-page', {
        token: '012345abcdef',
        story: 'My updated story'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fundraising/pages'
        )
        expect(request.url).to.contain('fundraising-page')
        expect(request.config.headers['Authorization']).to.eql(
          'Basic 012345abcdef'
        )
        done()
      })
    })

    it('updates the page summary correct url and data', done => {
      updatePage('fundraising-page', {
        token: '012345abcdef',
        summaryWhy: 'Just because giving'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fundraising/pages'
        )
        expect(request.url).to.contain('fundraising-page')
        expect(request.config.headers['Authorization']).to.eql(
          'Basic 012345abcdef'
        )
        done()
      })
    })

    it('updates the multiple page attributes with the correct url and data', done => {
      updatePage('page-slug', {
        token: '012345abcdef',
        attribution: 'Jonh Smith',
        story: 'My updated story',
        image: 'https://image.co/photo.jpg'
      })

      moxios.wait(() => {
        const requests = [
          moxios.requests.at(moxios.requests.count() - 3).url,
          moxios.requests.at(moxios.requests.count() - 2).url,
          moxios.requests.at(moxios.requests.count() - 1).url
        ]

        expect(requests).to.include(
          'https://api.justgiving.com/v1/fundraising/pages/page-slug/pagestory'
        )
        expect(requests).to.include(
          'https://api.justgiving.com/v1/fundraising/pages/page-slug/attribution'
        )
        expect(requests).to.include(
          'https://api.justgiving.com/v1/fundraising/pages/page-slug/images'
        )
        done()
      })
    })

    it('throws if no token is passed', () => {
      const test = () => updatePage('page-slug', { bogus: 'data' })
      expect(test).to.throw
    })
  })
})
