import moxios from 'moxios'
import { createTeam } from '..'
import { instance, servicesAPI, updateClient } from '../../../utils/client'

describe('Create a Team', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Create EDH Team', () => {
    it('throws if no token is passed', () => {
      const test = () => createTeam({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the supporter api with the correct url and data', done => {
      createTeam({
        token: '012345abcdef',
        page: 1234,
        name: 'My Team'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)

        expect(request.url).to.contain('https://everydayhero.com/api/v2/teams')
        expect(request.config.headers['Authorization']).to.eql(
          'Bearer 012345abcdef'
        )
        expect(data.name).to.eql('My Team')
        done()
      })
    })
  })

  describe('Create JG Team', () => {
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
      const test = () => createTeam({ bogus: 'data' })
      expect(test).to.throw
    })

    it('hits the JG api with the correct url and data', done => {
      createTeam({
        token: '012345abcdef',
        name: 'My Team',
        story: 'Lorem ipsum',
        target: 1000,
        campaignId: 'abc123',
        captainSlug: 'captain'
      })

      moxios.wait(() => {
        const shortNameRequest = moxios.requests.mostRecent()

        shortNameRequest.respondWith({ status: 404 })

        expect(shortNameRequest.url).to.contain(
          'https://api.blackbaud.services/v1/justgiving/proxy/campaigns/v1/teams/by-short-name/my-team/full'
        )

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          const data = JSON.parse(request.config.data)

          expect(request.url).to.contain('https://api.justgiving.com/v2/teams')
          expect(request.config.headers['Authorization']).to.eql(
            'Bearer 012345abcdef'
          )
          expect(data.name).to.eql('My Team')
          expect(data.teamShortName).to.eql('my-team')
          expect(data.campaignGuid).to.eql('abc123')
          expect(data.captainPageShortName).to.eql('captain')
          expect(data.teamTarget).to.eql(1000)
          done()
        })
      })
    })
  })
})
