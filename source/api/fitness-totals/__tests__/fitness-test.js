import moxios from 'moxios'
import { fetchFitnessTotals, fetchFitnessSummary } from '..'
import { singleCampaign, singleJGCampaign, multipleCampaigns } from './mocks'
import { instance, updateClient } from '../../../utils/client'
import fitnessTypes from '../consts/fitness-types'

const totalsEqual = (response, val) => {
  expect(response.distance).to.equal(val)
  expect(response.calories).to.equal(val)
  expect(response.duration).to.equal(val)
}

describe('Fetch Fitness Totals', () => {
  beforeEach(() => moxios.install(instance))
  afterEach(() => moxios.uninstall(instance))

  describe('with EDH', () => {
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

    it('Only returns a total of valid fitnessType(s) if requested', done => {
      fetchFitnessTotals('au-123', ['walk', 'run', 'jog']).then(response => {
        totalsEqual(response, 115)
        done()
      })
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith(singleCampaign)
      })
    })

    it('Returns default total if all supplied fitnessType(s) are invalid', done => {
      fetchFitnessTotals('au-123', ['dance', 'skip']).then(response => {
        totalsEqual(response, 240)
        done()
      })
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith(singleCampaign)
      })
    })

    it('Allows params to be passed as an object', done => {
      fetchFitnessTotals({ campaign: 'au-123', types: ['dance', 'skip'] }).then(
        response => {
          totalsEqual(response, 240)
          done()
        }
      )
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith(singleCampaign)
      })
    })
  })

  describe('with JG', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(instance)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it('uses the correct url to fetch totals', done => {
      fetchFitnessTotals('12345')
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fitness/campaign'
        )
        expect(request.url).to.contain('campaignGuid=12345')
        done()
      })
    })

    it('uses the correct url to fetch totals for multiple campaigns', done => {
      fetchFitnessTotals(['12345', '98765'])
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/fitness/campaign'
        )
        expect(request.url).to.contain('campaignGuid=12345&campaignGuid=98765')
        done()
      })
    })

    it('returns the distance for the campaign', done => {
      fetchFitnessTotals('12345').then(response => {
        expect(response.distance).to.equal(100)
        expect(response.elevation).to.equal(50)
        done()
      })
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith(singleJGCampaign)
      })
    })

    it('allows params to be passed as an object', done => {
      fetchFitnessTotals({ campaign: '12345' }).then(response => {
        expect(response.distance).to.equal(100)
        expect(response.elevation).to.equal(50)
        done()
      })
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith(singleJGCampaign)
      })
    })
  })
})

describe('Fetch Fitness Summary', () => {
  beforeEach(() => moxios.install(instance))
  afterEach(() => moxios.uninstall(instance))

  describe('with EDH', () => {
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

    describe('with JG', () => {
      beforeEach(() => {
        updateClient({
          baseURL: 'https://api.justgiving.com',
          headers: { 'x-api-key': 'abcd1234' }
        })
        moxios.install(instance)
      })

      afterEach(() => {
        updateClient({ baseURL: 'https://everydayhero.com' })
        moxios.uninstall(instance)
      })

      it('is not supported', () => {
        const test = () => fetchFitnessSummary('12345')
        expect(test).to.throw
      })
    })
  })
})
