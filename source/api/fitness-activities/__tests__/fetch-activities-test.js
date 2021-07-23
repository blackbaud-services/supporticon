import { instance } from '../../../utils/client'
import { fetchFitnessActivities } from '..'

describe('Fetch Fitness Activities', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('throws with incorrect params', () => {
    const test = () => fetchFitnessActivities({ charity: 'charity' })
    expect(test).to.throw
  })

  it('fetches activities for a campaign', done => {
    fetchFitnessActivities({ campaign: '12345678' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('/v1/fitness/campaign')
      expect(request.url).to.contain('campaignGuid=12345678')
      done()
    })
  })

  it('fetches activities for a page', done => {
    fetchFitnessActivities({ page: 'test-page', useLegacy: true })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('/v1/fitness/fundraising/test-page')
      done()
    })
  })

  it('fetches activities for a team', done => {
    fetchFitnessActivities({ team: 'test-team' })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('/v1/fitness/teams/test-team')
      done()
    })
  })
})
