import { post, instance, updateClient } from '..'

describe('Utils | post', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('performs a simple post request', done => {
    post('api/v2/pages', { foo: 'bar' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/pages')
      expect(JSON.parse(request.config.data)).to.deep.equal({ foo: 'bar' })
      done()
    })
  })

  it('rejects if the request returns a 404', done => {
    post('api/v2/does-not-exist', { foo: 'bar' }).catch(error => {
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

  it('rejects if the request returns a 500', done => {
    post('api/v2/campaigns', { foo: 'bar' }).catch(error => {
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

  it('throws if no endpoint is supplied', () => {
    const test = () => post()
    expect(test).to.throw
  })

  it('allows us to update the base url', done => {
    updateClient({ baseURL: 'https://everydayhero-staging.com' })
    post('api/v2/campaigns', { foo: 'bar' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://everydayhero-staging.com/api/v2/campaigns'
      )
      updateClient({ baseURL: 'https://everydayhero.com' })
      done()
    })
  })
})
