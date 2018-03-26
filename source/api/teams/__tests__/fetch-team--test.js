import moxios from 'moxios'
import { fetchTeams, fetchTeam } from '..'
import { instance, updateClient } from '../../../utils/client'

describe ('Fetch Teams', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  describe ('Fetch EDH Teams', () => {
    describe ('Fetch many teams', () => {
      it ('uses the correct url to fetch teams', (done) => {
        fetchTeams({ token: '123456' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain('https://everydayhero.com/api/v2/teams')
          done()
        })
      })

      it ('throws if no params are passed in', () => {
        const test = () => fetchTeams()
        expect(test).to.throw
      })
    })

    describe ('Fetch a single team', () => {
      it ('uses the correct url to fetch a single team', (done) => {
        fetchTeam({ id: '1234', token: '123456' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain('https://everydayhero.com/api/v2/teams')
          expect(request.url).to.contain('1234')
          done()
        })
      })

      it ('throws if no params are passed in', () => {
        const test = () => fetchTeam()
        expect(test).to.throw
      })
    })
  })

  describe ('Fetch JG Teams', () => {
    beforeEach (() => {
      moxios.install(instance)
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach (() => {
      moxios.uninstall(instance)
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    describe ('Fetch many teams', () => {
      it ('throws unsupported error', () => {
        const test = () => fetchTeams()
        expect(test).to.throw
      })
    })

    describe ('Fetch a single team', () => {
      it ('uses the correct url to fetch a single team', (done) => {
        fetchTeam('my-team')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain('https://api.justgiving.com/v1/team')
          expect(request.url).to.contain('my-team')
          done()
        })
      })

      it ('throws if no params are passed in', () => {
        const test = () => fetchTeam()
        expect(test).to.throw
      })
    })
  })
})
