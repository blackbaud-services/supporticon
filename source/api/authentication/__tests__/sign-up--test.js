import moxios from 'moxios'
import omit from 'lodash/omit'
import { instance } from '../../../utils/client'
import { signUp } from '..'

describe ('Authentication | Sign Up', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  const values = {
    clientId: '0123456789',
    name: 'Supporter User',
    email: 'test@gmail.com',
    password: 'password',
    phone: '0123456789'
  }

  it ('throws if no client id is passed', () => {
    const test = () => signUp(omit(values, ['clientId']))
    expect(test).to.throw
  })

  it ('throws if no name is passed', () => {
    const test = () => signUp(omit(values, ['name']))
    expect(test).to.throw
  })

  it ('throws if no email is passed', () => {
    const test = () => signUp(omit(values, ['email']))
    expect(test).to.throw
  })

  it ('throws if no password is passed', () => {
    const test = () => signUp(omit(values, ['password']))
    expect(test).to.throw
  })

  it ('throws if no phone is passed', () => {
    const test = () => signUp(omit(values, ['phone']))
    expect(test).to.throw
  })

  it ('should hit the supporter api with the correct url and data', (done) => {
    signUp(values)

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      const data = JSON.parse(request.config.data)
      expect(request.url).to.contain('https://everydayhero.com/api/v2/authentication/sign_up')
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

  it ('should return the user id and token on success', (done) => {
    signUp(values).then((data) => {
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
