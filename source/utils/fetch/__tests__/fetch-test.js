import fetch from '..'
import moxios from 'moxios'
import { update as updateBaseUrl } from '../../base-url'

describe ('Utils | Fetch', () => {
  beforeEach (() => {
    moxios.install()
  })

  afterEach (() => {
    moxios.uninstall()
  })

  it ('performs a simple get request', (done) => {
    fetch('api/v2/campaigns', { foo: 'bar' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
      expect(request.url).to.contain('foo=bar')
      expect(request.config.method).to.eql('get')
      done()
    })
  })

  it ('resolves to the fetched data', (done) => {
    fetch('api/v2/campaigns/au-1', { foo: 'bar' })
      .then((data) => {
        expect(data.campaign.uid).to.eql('au-1')
        expect(data.campaign.name).to.eql('Test Campaign')
        done()
      })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: {
          campaign: {
            uid: 'au-1',
            name: 'Test Campaign'
          }
        }
      })
    })
  })

  it ('rejects if the request returns a 404', (done) => {
    fetch('api/v2/campaigns/au-1', { foo: 'bar' })
      .catch((error) => {
        expect(error.status).to.eql(404)
        done()
      })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({
        status: 404
      })
    })
  })

  it ('rejects if the request returns a 500', (done) => {
    fetch('api/v2/campaigns/au-1', { foo: 'bar' })
      .catch((error) => {
        expect(error.status).to.eql(500)
        done()
      })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({
        status: 500
      })
    })
  })

  it ('throws if no endpoint is supplied', () => {
    const test = () => fetch()
    expect(test).to.throw
  })

  it ('allows us to update the base url', () => {
    updateBaseUrl('https://everydayhero-staging.com')
    fetch('api/v2/campaigns', { foo: 'bar' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero-staging.com/api/v2/campaigns')
      updateBaseUrl('https://everydayhero.com')
      done()
    })
  })
})
