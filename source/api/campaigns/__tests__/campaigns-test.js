import { servicesAPI } from '../../../utils/client'
import { fetchCampaigns, fetchCampaign } from '..'

describe('Fetch Campaigns', () => {
  beforeEach(() => {
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(servicesAPI)
  })

  it('fetches multiple campaigns if ids are passed', done => {
    fetchCampaigns({ ids: ['my-campaign', 'another-campaign'] })
    moxios.wait(() => {
      const firstRequest = moxios.requests.at(0)
      const secondRequest = moxios.requests.at(1)

      expect(firstRequest.url).to.equal(
        '/v1/justgiving/campaigns/my-campaign'
      )
      expect(secondRequest.url).to.equal(
        '/v1/justgiving/campaigns/another-campaign'
      )
      done()
    })
  })

  it('fetches a single campaign', done => {
    fetchCampaign('my-campaign')
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.equal(
        '/v1/justgiving/campaigns/my-campaign'
      )
      done()
    })
  })

  it('throws if a campaign is requested, but no campaign id is supplied', () => {
    const test = () => fetchCampaign()
    expect(test).to.throw
  })

  it('throws if multiple campaigns are requested without ids', () => {
    const test = () => fetchCampaigns({ charity: 'foo' })
    expect(test).to.throw
  })
})
