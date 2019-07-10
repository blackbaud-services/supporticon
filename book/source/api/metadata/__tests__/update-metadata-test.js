import moxios from 'moxios'
import { metadataAPI, updateClient } from '../../../utils/client'

import { updateMetadata } from '..'

describe('Updating Metadata', () => {
  describe('Update EDH Metadata', () => {
    beforeEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.install(metadataAPI)
    })

    afterEach(() => {
      moxios.uninstall(metadataAPI)
    })

    it('creates metadata with the provided params', done => {
      updateMetadata({
        id: '123',
        token: 'token',
        key: 'key',
        value: 'value'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://mds-engineering.everydayhero.com'
        )
        done()
      })
    })

    it('throws if required params are not supplied', () => {
      const test = () => updateMetadata()
      expect(test).to.throw
    })
  })

  describe('Update JG Metadata', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(metadataAPI)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(metadataAPI)
    })

    it('creates metadata with the provided params', done => {
      updateMetadata({
        app: '123',
        id: '123',
        token: '123',
        key: 'key',
        value: 'value'
      })

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain(
          'https://metadata.blackbaud.services/v1/apps/123/metadata'
        )
        done()
      })
    })

    it('throws if required params are not supplied', () => {
      const test = () => updateMetadata()
      expect(test).to.throw
    })
  })
})
