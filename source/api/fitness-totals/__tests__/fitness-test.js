import moxios from 'moxios'
import { fetchFitnessTotals, fetchFitnessSummary } from '..'
import { singleCampaign, multipleCampaigns } from './mocks'
import { instance } from '../../../utils/client'
import fitnessTypes from '../consts/fitness-types'

const totalsEqual = (response, val) => {
  expect(response.distance).to.equal(val)
  expect(response.calories).to.equal(val)
  expect(response.duration).to.equal(val)
}

describe('Fetch Fitness Totals', () => {
  beforeEach(() => moxios.install(instance))
  afterEach(() => moxios.uninstall(instance))

  it('Combines all categories into a total', done => {
    fetchFitnessTotals('au-123').then(response => {
      totalsEqual(response, 240)
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(singleCampaign)
    })
  })

  it('Combines totals from two campaigns if an array of ids is supplied', done => {
    fetchFitnessTotals(['au-123', 'au-123']).then(response => {
      totalsEqual(response, 365)
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(multipleCampaigns)
    })
  })

  it('Only return a total of valid fitnessType(s) if requested', done => {
    fetchFitnessTotals('au-123', ['walk', 'run', 'jog']).then(response => {
      totalsEqual(response, 115)
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(singleCampaign)
    })
  })

  it('Return default total if all supplied fitnessType(s) are invalid', done => {
    fetchFitnessTotals('au-123', ['dance', 'skip']).then(response => {
      totalsEqual(response, 240)
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(singleCampaign)
    })
  })
})

describe('Fetch Fitness Summary', () => {
  beforeEach(() => moxios.install(instance))
  afterEach(() => moxios.uninstall(instance))

  it('Retuns an object with the correct shape', done => {
    fetchFitnessSummary('au-123').then(response => {
      expect(Object.keys(response).join()).to.equal(fitnessTypes.join())
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(singleCampaign)
    })
  })

  it('Returns a total summary of all campaigns requested', done => {
    fetchFitnessSummary(['au-123', 'au-123']).then(response => {
      totalsEqual(response.bike, 20)
      totalsEqual(response.climb, 0)
      totalsEqual(response.gym, 20)
      totalsEqual(response.hike, 30)
      totalsEqual(response.run, 80)
      totalsEqual(response.sport, 5)
      totalsEqual(response.swim, 60)
      totalsEqual(response.walk, 150)
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(multipleCampaigns)
    })
  })

  it('Returns only the valid fitnessType(s) if requested', done => {
    fetchFitnessSummary('au-123', ['walk', 'jog']).then(response => {
      totalsEqual(response.walk, 75)
      expect(response.jog).to.equal(undefined)
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(singleCampaign)
    })
  })

  it('Return default summary if all supplied fitnessType(s) are invalid', done => {
    fetchFitnessSummary('au-123', ['dance', 'skip']).then(response => {
      totalsEqual(response.bike, 10)
      totalsEqual(response.climb, 0)
      totalsEqual(response.gym, 20)
      totalsEqual(response.hike, 30)
      totalsEqual(response.run, 40)
      totalsEqual(response.sport, 5)
      totalsEqual(response.swim, 60)
      totalsEqual(response.walk, 75)
      done()
    })
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(singleCampaign)
    })
  })
})
