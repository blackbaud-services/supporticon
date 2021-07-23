import { uploadImage } from '..'
import { imagesAPI, servicesAPI } from '../../../utils/client'

describe('Uploading images', () => {
  beforeEach(() => {
    moxios.install(imagesAPI)
    moxios.install(servicesAPI)
  })

  afterEach(() => {
    moxios.uninstall(imagesAPI)
    moxios.uninstall(servicesAPI)
  })

  it('uses the correct url for external images', done => {
    uploadImage('https://example.com/image.jpg')

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.eql(
        'https://api.blackbaud.services/v1/justgiving/images'
      )
      expect(request.config.method).to.eql('post')
      done()
    })
  })

  it('uses the correct url for base64 URLs', done => {
    uploadImage(
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    )

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.eql('https://images.justgiving.com/image')
      expect(request.config.method).to.eql('post')
      done()
    })
  })

  it('uses the correct url for files', done => {
    uploadImage({ name: 'image.jpg', size: 123 })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).to.eql('https://images.justgiving.com/image')
      expect(request.config.method).to.eql('post')
      done()
    })
  })
})
