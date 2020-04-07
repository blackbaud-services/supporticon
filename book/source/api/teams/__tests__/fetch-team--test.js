import moxios from 'moxios'
import { fetchTeams, fetchTeam, fetchTeamBySlug } from '..'
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

      it('uses the correct urls to fetch a single team by slug', done => {
        const params = {
          slug: 'my-team',
          campaignSlug: 'my-campaign',
          countryCode: 'au'
        }

        fetchTeamBySlug(params)
        moxios.wait(() => {
          const v3Request = moxios.requests.at(0)
          v3Request.respondWith({
            status: 200,
            response: {
              page: {
                id: 123
              }
            }
          })

          moxios.wait(() => {
            const v2Request = moxios.requests.at(1)
            v2Request.respondWith({
              status: 200,
              response: {
                page: {
                  team_member_uids: [1, 2, 3]
                }
              }
            })

            moxios.wait(() => {
              const membersRequest = moxios.requests.at(2)

              expect(v3Request.url).to.contain(
                'https://everydayhero.com/api/v3/prerelease/pages/au/my-campaign/my-team'
              )
              expect(v2Request.url).to.contain(
                'https://everydayhero.com/api/v2/pages/123'
              )
              expect(membersRequest.url).to.contain(
                'https://everydayhero.com/api/v2/pages?ids=1,2,3'
              )
              done()
            })
          })
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
        fetchTeam('uuid')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/campaigns/v1/teams/uuid/full'
          )
          done()
        })
      })

      it('uses the correct url to fetch a single team by short name', done => {
        fetchTeamBySlug('my-team')
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()
          expect(request.url).to.contain(
            'https://api.justgiving.com/campaigns/v1/teams/by-short-name/my-team/full'
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
