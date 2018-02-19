import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { fetchCurrentUser } from '..'

describe ('Fetch User', () => {
  describe ('Fetch EDH User', () => {
    beforeEach (() => {
      moxios.install(instance)
    })

    afterEach (() => {
      moxios.uninstall(instance)
    })

    it ('throws if no token is passed', () => {
      const test = () => fetchCurrentUser({ bogus: 'data' })
      expect(test).to.throw
    })

    it ('hits the supporter api with the correct url and data', (done) => {
      fetchCurrentUser({ token: '012345abcdef' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v1/me?access_token=012345abcdef')
        expect(request.config.params.access_token).to.eql('012345abcdef')
        done()
      })
    })

    it ('errors when an invalid token is provided', (done) => {
      fetchCurrentUser({ token: 'bogus' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v1/me?access_token=bogus')

        request.respondWith({ status: 401 }).then((response) => {
          expect(response.status).to.eql(401)
          done()
        })
      })
    })

    it ('returns the user JSON on success', (done) => {
      fetchCurrentUser({
        token: '012345abcdef'
      }).then((data) => {
        expect(data.name).to.eql('John Smith')
        expect(data.email).to.eql('john@example.com')
        expect(data.birthday).to.eql('1970-01-01')
        done()
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            user: {
              uid: '123456',
              name: 'John Smith',
              email: 'john@example.com',
              nickname: 'John',
              birthday: '1970-01-01',
              street_address: '333 Ann St',
              extended_address: 'Level 8',
              locality: 'Brisbane City',
              region: 'Queensland',
              postal_code: '4000',
              country_name: 'Australia',
              phone: '1300 798 768',
              internal_id: 123456,
              id: '123456',
              formatted_address: '333 Ann St, Brisbane City, Queensland, 4000, Australia',
              paf_validated: false,
              uuid: '123abcde-9876-a1b1-1234-abcdefgh1234',
              country_code: 'au',
              notification_options: {},
              charity_uuids: [],
              admin: false,
              first_name: 'John',
              last_name: 'Smith',
              page_ids: []
            }
          }
        })
      })
    })
  })

  describe ('Fetch JG User', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('throws if no token is passed', () => {
      const test = () => fetchCurrentUser({ bogus: 'data' })
      expect(test).to.throw
    })

    it ('hits the JG api with the correct url and data', (done) => {
      fetchCurrentUser({ token: 'dGVzdEBleGFtcGxlLmNvbTpmb29iYXIxMjM=' })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://api.justgiving.com/v1/account')
        expect(request.config.headers['Authorization']).to.eql('Basic dGVzdEBleGFtcGxlLmNvbTpmb29iYXIxMjM=')
        done()
      })
    })
  })
})
