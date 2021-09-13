import { fetchFitnessTotals } from '..'
import { singleCampaign } from './mocks'
import { instance, servicesAPI } from '../../../utils/client'

describe('Fetch Fitness Totals', () => {
  beforeEach(() => {
    moxios.install(instance)
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(instance)
    moxios.uninstall(servicesAPI)
  })

  it('uses the correct url to fetch totals', done => {
    fetchFitnessTotals({ campaign: '12345', useLegacy: false })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      const data = JSON.parse(request.config.data)
      expect(request.url).to.contain(
        '/v1/justgiving/graphql'
      )
      expect(data.query).to.contain('page:campaign:12345')
      done()
    })
  })

  it('uses the correct url to fetch totals for multiple campaigns', done => {
    fetchFitnessTotals({ campaign: ['12345', '98765'] })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain(
        '/v1/fitness/campaign'
      )
      expect(request.url).to.contain('campaignGuid=12345&campaignGuid=98765')
      done()
    })
  })

  it('returns the distance for the campaign', done => {
    fetchFitnessTotals({ campaign: '12345', useLegacy: false }).then(
      response => {
        expect(response.fitnessDistanceTotal).to.equal(100)
        expect(response.fitnessElevationTotal).to.equal(100)
        expect(response.fitnessDurationTotal).to.equal(60)
        done()
      }
    )
    moxios.wait(() => {
      moxios.requests.mostRecent().respondWith(singleCampaign)
    })
  })
})
