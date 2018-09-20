import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { signIn } from '..'

describe('Authentication | Sign In', () => {
  describe('Login EDH User', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('throws if no client id is passed', () => {
      const test = () =>
        signIn({
          email: 'test@gmail.com',
          password: 'password'
        })
      expect(test).to.throw
    })

    it('throws if no email is passed', () => {
      const test = () =>
        signIn({
          clientId: '0123456789',
          password: 'password'
        })
      expect(test).to.throw
    })

    it('throws if no password is passed', () => {
      const test = () =>
        signIn({
          clientId: '0123456789',
          email: 'test@gmail.com'
        })
      expect(test).to.throw
    })

    it('should hit the supporter api with the correct url and data', done => {
      signIn({
        clientId: '0123456789',
        email: 'test@gmail.com',
        password: 'password'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/authentication/sign_in'
        )
        expect(data.client_id).to.eql('0123456789')
        expect(data.user).to.eql({
          email: 'test@gmail.com',
          password: 'password'
        })
        done()
      })
    })

    it('should return the user id and token on success', done => {
      signIn({
        clientId: '0123456789',
        email: 'test@gmail.com',
        password: 'password'
      }).then(data => {
        expect(data.userId).to.eql('user123')
        expect(data.token).to.eql('token123')
        done()
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            user_id: 'user123',
            token: 'token123'
          }
        })
      })
    })
  })

  describe('Login JG User', () => {
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

    it('should hit the supporter api with the correct url and data', done => {
      signIn({
        email: 'test@gmail.com',
        password: 'password'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql('https://api.justgiving.com/v1/account')
        done()
      })
    })

    it('throws if no password is passed', () => {
      const test = () => signUp({ email: 'test@gmail.com', password: '' })
      expect(test).to.throw
    })

    it('throws if no parameters are provided', () => {
      const test = () => signIn()
      expect(test).to.throw
    })
  })
})
