import moxios from 'moxios'
import { instance } from '../../../utils/fetch'
import * as actions from '../../../utils/actions'

import { fetchPages } from '..'

describe ('Fetch Pages', () => {
  beforeEach (() => {
    moxios.install(instance)
  })

  afterEach (() => {
    moxios.uninstall(instance)
  })

  it ('should use the correct url to fetch pages', (done) => {
    fetchPages({ campaign_id: 'au-6839' })
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.contain('https://everydayhero-staging.com/api/v2/search/pages')
      expect(request.url).to.contain('campaign_id=au-6839')
      done()
    })
  })

  it ('should throw if no params are passed in', () => {
    const test = () => fetchPages()
    expect(test).to.throw
  })
})
