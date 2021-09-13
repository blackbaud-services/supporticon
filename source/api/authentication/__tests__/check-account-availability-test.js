import { checkAccountAvailability } from '..'
import { instance } from '../../../utils/client'

describe('Authentication | Check Account Availability', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('makes request to consumer API', done => {
    checkAccountAvailability('foo@mail.com')

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('/v1/account/foo@mail.com')
      done()
    })
  })

  it('throws if email not provided', () => {
    const test = () => checkAccountAvailability()
    expect(test).to.throw
  })
})
