import moxios from 'moxios'
import { put, instance, updateClient } from '..'

describe ('Utils | put', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('performs a simple put request', (done) => {
    put('api/v2/users/123', { foo: 'bar' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/users/123')
      expect(JSON.parse(request.config.data)).to.deep.equal({ foo: 'bar' })
      done()
    })
  })

  it ('rejects if the request returns a 404', (done) => {
    put('api/v2/does-not-exist', { foo: 'bar' })
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
    put('api/v2/pages/123', { foo: 'bar' })
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
    const test = () => put()
    expect(test).to.throw
  })

  it ('allows us to update the base url', (done) => {
    updateClient({ baseURL: 'https://everydayhero-staging.com' })
    put('api/v2/pages/123', { foo: 'bar' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero-staging.com/api/v2/pages/123')
      updateClient({ baseURL: 'https://everydayhero.com' })
      done()
    })
  })
})
