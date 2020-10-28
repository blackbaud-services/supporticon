import moxios from 'moxios'
import { checkAccountAvailability } from '..'
import { updateClient, instance } from '../../../utils/client'

describe('Authentication | Check Account Availability', () => {
  describe('EDH', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('throws', () => {
      const test = () => connectToken()
      expect(test).to.throw
    })
  })

  describe('Check JG Account', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(instance)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it('makes request to consumer API', done => {
      checkAccountAvailability('foo@mail.com')

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/account/foo@mail.com'
        )

        done()
      })
    })

    it('throws if email not provided', () => {
      const test = () => checkAccountAvailability()
      expect(test).to.throw
    })
  })
})
