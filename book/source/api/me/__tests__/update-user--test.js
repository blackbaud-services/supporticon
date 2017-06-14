import moxios from 'moxios'
import { instance } from '../../../utils/client'
import { updateCurrentUser } from '..'

describe ('User | Update User', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('throws if no token is passed', () => {
    const test = () => updateCurrentUser({
      bogus: 'data'
    })
    expect(test).to.throw
  })

  it ('hits the supporter api with the correct url and data', (done) => {
    updateCurrentUser({
      token: '012345abcdef',
      birthday: '1970-01-02'
    })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v1/me?access_token=012345abcdef')
      done()
    })
  })

  it ('errors when an invalid token is provided', (done) => {
    updateCurrentUser({
      token: 'bogus',
      birthday: '1970-01-02'
    })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v1/me?access_token=bogus')

      request.respondWith({ status: 401 }).then((response) => {
        expect(response.status).to.eql(401)
        done()
      })
    })
  })

  it ('updates the user successfully with the provided params', (done) => {
    updateCurrentUser({
      token: '012345abcdef',
      birthday: '1970-01-02'
    })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v1/me?access_token=012345abcdef')

      request.respondWith({ status: 204 }).then((response) => {
        expect(response.status).to.eql(204)
        done()
      })
    })
  })
})
