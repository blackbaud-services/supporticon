import moxios from 'moxios'
import omit from 'lodash/omit'
import { instance, servicesAPI, updateClient } from '../../../utils/client'
import { signUp } from '..'

describe('Authentication | Sign Up', () => {
  describe('Sign Up EDH User', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    const values = {
      clientId: '0123456789',
      name: 'Supporter User',
      email: 'test@gmail.com',
      password: 'password',
      phone: '0123456789'
    }

    it('throws if no client id is passed', () => {
      const test = () => signUp(omit(values, ['clientId']))
      expect(test).to.throw
    })

    it('throws if no name is passed', () => {
      const test = () => signUp(omit(values, ['name']))
      expect(test).to.throw
    })

    it('throws if no email is passed', () => {
      const test = () => signUp(omit(values, ['email']))
      expect(test).to.throw
    })

    it('throws if no password is passed', () => {
      const test = () => signUp(omit(values, ['password']))
      expect(test).to.throw
    })

    it('throws if no phone is passed', () => {
      const test = () => signUp(omit(values, ['phone']))
      expect(test).to.throw
    })

    it('should hit the supporter api with the correct url and data', done => {
      signUp(values)

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        expect(request.url).to.contain(
          'https://everydayhero.com/api/v2/authentication/sign_up'
        )
        expect(data.client_id).to.eql('0123456789')
        expect(data.user).to.eql({
          name: 'Supporter User',
          email: 'test@gmail.com',
          password: 'password',
          phone: '0123456789'
        })
        done()
      })
    })

    it('should return the user id and token on success', done => {
      signUp(values).then(data => {
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

  describe('Register JG User Account', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(servicesAPI)
      moxios.install(instance)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(servicesAPI)
      moxios.uninstall(instance)
    })

    describe('should hit the JG api with the correct url and data', () => {
      it('with address supplied', done => {
        signUp({
          title: 'Mr',
          firstName: 'Just',
          lastName: 'Giving',
          email: 'test@gmail.com',
          password: 'password',
          address: {
            line1: '333 Ann Street',
            line2: 'Level 8',
            townOrCity: 'Brisbane',
            countyOrState: 'Queensland',
            country: 'Australia',
            postcodeOrZipcode: '4000'
          }
        })

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          const data = JSON.parse(request.config.data)
          expect(request.url).to.eql('https://api.justgiving.com/v1/account')
          expect(data.email).to.eql('test@gmail.com')
          done()
        })
      })

      it('without address supplied', done => {
        signUp({
          firstName: 'Just',
          lastName: 'Giving',
          email: 'test@gmail.com',
          password: 'password'
        })

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          const data = JSON.parse(request.config.data)
          expect(request.url).to.eql(
            'https://api.justgiving.com/v1/account/lite'
          )
          expect(data.email).to.eql('test@gmail.com')
          done()
        })
      })
    })

    describe('should hit the IAM api with the correct url and data', () => {
      it('with address supplied', done => {
        signUp({
          authType: 'Bearer',
          firstName: 'Just',
          lastName: 'Giving',
          email: 'test@gmail.com',
          password: 'password'
        })

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          const data = JSON.parse(request.config.data)
          expect(request.url).to.eql(
            'https://api.blackbaud.services/v1/justgiving/iam/register'
          )
          expect(data.email).to.eql('test@gmail.com')
          done()
        })
      })

      it('without address supplied', done => {
        signUp({
          firstName: 'Just',
          lastName: 'Giving',
          email: 'test@gmail.com',
          password: 'password'
        })

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          const data = JSON.parse(request.config.data)
          expect(request.url).to.eql(
            'https://api.justgiving.com/v1/account/lite'
          )
          expect(data.email).to.eql('test@gmail.com')
          done()
        })
      })
    })

    it('throws if no parameters are provided', () => {
      const test = () => signUp()
      expect(test).to.throw
    })

    it('throws if request is missing required params', () => {
      const test = () =>
        signUp({
          title: 'Mr',
          firstName: 'Just',
          email: 'test@gmail.com'
        })

      expect(test).to.throw
    })
  })
})
