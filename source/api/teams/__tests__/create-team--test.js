import moxios from 'moxios'
import { createTeam } from '..'
import { instance, updateClient } from '../../../utils/client'

describe ('Create a Team', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  describe ('Create EDH Team', () => {
    it ('throws if no token is passed', () => {
      const test = () => createTeam({ bogus: 'data' })
      expect(test).to.throw
    })

    it ('hits the supporter api with the correct url and data', (done) => {
      createTeam({
        token: '012345abcdef',
        page: 1234,
        name: 'My Team'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)

        expect(request.url).to.contain('https://everydayhero.com/api/v2/teams')
        expect(request.config.headers['Authorization']).to.eql('Bearer 012345abcdef')
        expect(data.name).to.eql('My Team')
        done()
      })
    })
  })

  describe ('Create JG Team', () => {
    beforeEach (() => {
      moxios.install(instance)
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach (() => {
      moxios.uninstall(instance)
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    it ('throws if no token is passed', () => {
      const test = () => createTeam({ bogus: 'data' })
      expect(test).to.throw
    })

    it ('hits the JG api with the correct url and data', (done) => {
      createTeam({
        token: '012345abcdef',
        name: 'My Team',
        slug: 'my-team',
        story: 'Lorem ipsum',
        target: 1000
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)

        expect(request.url).to.contain('https://api.justgiving.com/v1/team')
        expect(request.config.headers['Authorization']).to.eql('Basic 012345abcdef')
        expect(data.teamShortName).to.eql('my-team')
        done()
      })
    })
  })
})
