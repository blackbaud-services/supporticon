import { instance, servicesAPI } from '../../../utils/client'
import { fetchLeaderboard } from '..'

describe('Fetch Leaderboards', () => {
  beforeEach(() => {
    moxios.install(instance)
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(instance)
    moxios.uninstall(servicesAPI)
  })

  it('throws if no params are passed in', () => {
    const test = () => fetchLeaderboard()
    expect(test).to.throw
  })

  it('uses the correct url to fetch a campaign leaderboard', done => {
    fetchLeaderboard({ campaign: '1234' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://api.justgiving.com/donationsleaderboards/v1/leaderboard?campaignGuids=1234'
      )
      done()
    })
  })

  it('uses the correct url to fetch a team leaderboard', done => {
    fetchLeaderboard({ campaign: '1234', type: 'team' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://api.justgiving.com/donationsleaderboards/v1/leaderboard?campaignGuids=1234&groupBy=TeamGuid'
      )
      done()
    })
  })

  it('uses the correct url to fetch a campaign leaderboard with all pages', done => {
    fetchLeaderboard({ campaign: 'my-campaign', allPages: true })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        'https://api.blackbaud.services/v1/justgiving/campaigns/my-campaign/pages'
      )
      done()
    })
  })

  it('uses the correct url to fetch an event leaderboard', done => {
    fetchLeaderboard({ event: 12345 })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal(
        'https://api.justgiving.com/v1/events/leaderboard?eventid=12345&currency=GBP'
      )
      done()
    })
  })

  it('allows ther country (and currency) to be set', done => {
    fetchLeaderboard({ event: 12345, country: 'au' })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal(
        'https://api.justgiving.com/v1/events/leaderboard?eventid=12345&currency=AUD'
      )
      done()
    })
  })

  it('fetches pages for multiple events', done => {
    fetchLeaderboard({ event: [12345, 54321] })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal(
        'https://api.justgiving.com/v1/events/leaderboard?eventid=12345&eventid=54321&currency=GBP'
      )
      done()
    })
  })

  it('allows you to specify the number of pages to return', done => {
    fetchLeaderboard({ event: 12345, limit: 50 })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal(
        'https://api.justgiving.com/v1/events/leaderboard?eventid=12345&currency=GBP&maxResults=50'
      )
      done()
    })
  })

  it('throws if incorrect params are passed in for an event leaderboard', () => {
    const test = () => fetchLeaderboard({ event: 'my-event' })
    expect(test).to.throw
  })

  it('uses the correct url to fetch a charity leaderboard', done => {
    fetchLeaderboard({ charity: 4567 })
    moxios.wait(function () {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.include(
        'https://api.justgiving.com/donationsleaderboards/v1/leaderboard?charityIds=4567'
      )
      done()
    })
  })

  it('throws if incorrect params are passed in for a charity leaderboard', () => {
    const test = () => fetchLeaderboard({ charity: 'my-charity' })
    expect(test).to.throw
  })
})
