import { resetPassword } from '..'
import { instance, servicesAPI } from '../../../utils/client'

describe('Authentication | Reset Password', () => {
  beforeEach(() => {
    moxios.install(servicesAPI)
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(servicesAPI)
    moxios.uninstall(instance)
  })

  it('sends reset password email using the provided params', done => {
    resetPassword({ email: 'test@example.com' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()

      expect(request.url).to.contain(
        'https://api.blackbaud.services/v1/justgiving/iam/reset-password'
      )
      expect(JSON.parse(request.config.data).email).to.eql('test@example.com')
      done()
    })
  })

  it('throws if no parameters are provided', () => {
    const test = () => resetPassword()
    expect(test).to.throw
  })
})
