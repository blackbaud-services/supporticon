import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'
import { createPageTag } from '..'

describe('Create Page', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  describe('Create EDH Page', () => {
    it('is not supported', () => {
      const test = () =>
        createPageTag({
          slug: 'my-page',
          id: '123',
          label: 'Number',
          value: '1'
        })

      expect(test).to.throw
    })
  })

  describe('Create JG Page', () => {
    beforeEach(() => {
      updateClient({ baseURL: 'https://api.justgiving.com' })
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
    })

    it('uses the correct url to fetch pages', done => {
      createPageTag({
        slug: 'my-page',
        label: 'State',
        id: 'state',
        value: 'Queensland',
        aggregation: [
          {
            segment: 'page:campaign:1234-5678-abcd-0123',
            measurementDomains: ['all']
          }
        ]
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://api.justgiving.com/v1/tags/my-page'
        )
        done()
      })
    })

    it('throws if no slug is passed', () => {
      const test = () => createPageTag({ bogus: 'data' })
      expect(test).to.throw
    })
  })
})
