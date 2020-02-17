import moxios from 'moxios'
import { fetchTeams, fetchTeam } from '..'
import { instance, updateClient } from '../../../utils/client'

describe('Fetch Teams', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Fetch EDH Teams', () => {
    describe('Fetch many teams', () => {
      it('uses the correct url to fetch teams', done => {
        fetchTeams({ campaign: 'abc123' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://everydayhero.com/api/v2/pages?type=team&campaign_id=abc123'
          )
          done()
        })
      })

      it('throws if no params are passed in', () => {
        const test = () => fetchTeams()
        expect(test).to.throw
      })
    })

    describe('Fetch a single team', () => {
      it('uses the correct url to fetch a single team', done => {
        fetchTeam('1234')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://everydayhero.com/api/v2/pages/1234'
          )
          done()
        })
      })

      it('throws if no params are passed in', () => {
        const test = () => fetchTeam()
        expect(test).to.throw
      })
    })
  })

  describe('Fetch JG Teams', () => {
    beforeEach(() => {
      moxios.install(instance)
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      moxios.uninstall(instance)
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    describe('Fetch many teams', () => {
      it('uses the correct url to fetch teams', done => {
        fetchTeams({ campaign: 'abc123' })
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/campaigns/v1/teams/search'
          )
          expect(request.url).to.contain('CampaignGuid=abc123')
          done()
        })
      })
    })

    describe('Fetch a single team', () => {
      it('uses the correct url to fetch a single team', done => {
        fetchTeam('my-team')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/campaigns/v1/teams/my-team/full'
          )
          done()
        })
      })

      it('throws if no params are passed in', () => {
        const test = () => fetchTeam()
        expect(test).to.throw
      })
    })
  })
})
