import fetch, { instance } from '..'
import moxios from 'moxios'

describe ('Utils | Fetch', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('should give us an axios instance', () => {
    expect(typeof instance.get).to.eql('function')
    expect(typeof instance.post).to.eql('function')
    expect(typeof instance.put).to.eql('function')
  })

  it ('should perform a simple get request', (done) => {
    fetch('api/v2/campaigns', { foo: 'bar' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero-staging.com/api/v2/campaigns')
      expect(request.url).to.contain('foo=bar')
      expect(request.config.method).to.eql('get')
      done()
    })
  })

  it ('should resolve to the fetched data', (done) => {
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

  it ('should reject if the request returns a 404', (done) => {
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

  it ('should reject if the request returns a 500', (done) => {
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

  it ('should throw if no endpoint is supplied', () => {
    const test = () => fetch()
    expect(test).to.throw
  })
})
