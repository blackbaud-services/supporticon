import { instance, servicesAPI } from '../../../utils/client'
import { signUp } from '..'

describe('Authentication | Sign Up', () => {
  beforeEach(() => {
    moxios.install(instance)
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(instance)
    moxios.uninstall(servicesAPI)
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
        expect(request.url).to.eql('/v1/account')
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
        expect(request.url).to.eql('/v1/account/lite')
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
          '/v1/justgiving/iam/register'
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
        expect(request.url).to.eql('/v1/account/lite')
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
