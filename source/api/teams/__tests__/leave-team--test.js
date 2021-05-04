import moxios from 'moxios'
import { leaveTeam } from '../justgiving'
import { instance, servicesAPI, updateClient } from '../../../utils/client'

describe('Leave a Team', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Leave JG Team', () => {
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
      const test = () => leaveTeam({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the Services API with the correct url and data', done => {
      leaveTeam({
        pageSlug: 'my-page',
        teamSlug: 'my-team',
        token: '012345abcdef'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.eql(
          'https://api.blackbaud.services/v1/justgiving/teams/leave'
        )
        expect(request.config.headers['Authorization']).to.eql(
          'Bearer 012345abcdef'
        )
        done()
      })
    })
  })
})
