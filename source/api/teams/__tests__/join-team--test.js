import moxios from 'moxios'
import { joinTeam } from '..'
import { instance, servicesAPI, updateClient } from '../../../utils/client'

describe('Join a Team', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Join EDH Team', () => {
    it('throws if no token is passed', () => {
      const test = () => joinTeam({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      joinTeam({
        token: '012345abcdef',
        id: 4321,
        page: 1234
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)

        expect(request.url).to.contain('https://everydayhero.com/api/v2/teams')
        expect(request.config.headers['Authorization']).to.eql(
          'Bearer 012345abcdef'
        )
        done()
      })
    })
  })

  describe('Join JG Team', () => {
    beforeEach(() => {
      moxios.install(instance)
      moxios.install(servicesAPI)
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      moxios.uninstall(instance)
      moxios.uninstall(servicesAPI)
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    it('throws if no token is passed', () => {
      const test = () => joinTeam({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the JG api with the correct url and data', done => {
      joinTeam({
        pageId: '4321-9876-xyz4567-1234',
        pageSlug: 'my-page',
        teamId: '1234-5436-abc1234-9876',
        teamSlug: 'my-team',
        token: '012345abcdef'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.blackbaud.services/v1/justgiving/teams/join'
        )
        expect(request.config.headers['Authorization']).to.eql(
          'Bearer 012345abcdef'
        )
        done()
      })
    })
  })
})
