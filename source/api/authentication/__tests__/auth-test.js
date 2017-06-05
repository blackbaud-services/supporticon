import moxios from 'moxios'
import { resetPassword } from '..'
import { instance } from '../../../utils/client'

describe ('Authentication', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('sends reset password email using the provided params', (done) => {
    resetPassword({
      clientId: '12345678abcdefg',
      email: 'test@example.com'
    })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero.com/api/v2/authentication/reset_password')

      request.respondWith({ status: 204 }).then((response) => {
        expect(response.status).to.eql(204)
        done()
      })
    })
  })

  it ('reset password request throws if no parameters are provided', () => {
    const test = () => resetPassword()
    expect(test).to.throw
  })

  it ('reset password request throws if no clientId param is provided', () => {
    const test = () => resetPassword({
      email: 'test@gmail.com'
    })

    expect(test).to.throw
  })
})
