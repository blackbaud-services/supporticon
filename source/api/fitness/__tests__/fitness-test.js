import { connectFitness, disconnectFitness, updateFitnessSettings } from '..'
import { instance, servicesAPI } from '../../../utils/client'

describe('Fitness', () => {
  beforeEach(() => {
    moxios.install(instance)
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(instance)
    moxios.uninstall(servicesAPI)
  })

  describe('Connect fitness', () => {
    it('uses the correct url with JWT', done => {
      connectFitness({
        code: '12345678',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        expect(request.config.method).to.eql('post')
        done()
      })
    })

    it('throws if no token is passed', () => {
      const test = () => connectFitness({ bogus: 'data' })
      expect(test).to.throw
    })
  })

  describe('Disconnect fitness', () => {
    it('uses the correct url with JWT', done => {
      disconnectFitness({
        pageId: '1234',
        pageSlug: 'my-page',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        expect(request.config.method).to.eql('post')
        done()
      })
    })

    it('throws if no token is passed', () => {
      const test = () => disconnectFitness({ bogus: 'data' })
      expect(test).to.throw
    })
  })

  describe('Update fitness settings', () => {
    it('uses the correct url with JWT', done => {
      updateFitnessSettings({
        pageId: '1234',
        subscribedActivities: ['walk'],
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.blackbaud.services/v1/justgiving/graphql'
        )
        expect(request.config.method).to.eql('post')
        done()
      })
    })

    it('throws if no token is passed', () => {
      const test = () => updateFitnessSettings({ bogus: 'data' })
      expect(test).to.throw
    })
  })
})
