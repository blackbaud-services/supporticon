import { dataURIToBlob } from 'constructicon/lib/files'

export const isBase64EncodedUrl = url =>
  /data:image\/([a-zA-Z]*);base64,([^"]*)/.test(url)

export const handleImageFile = (image, name = 'file') => {
  if (typeof window !== 'undefined') {
    const formData = new window.FormData()
    const file = isBase64EncodedUrl(image) ? dataURIToBlob(image) : image

    formData.append(name, file)

    return formData
  }

  return Promise.reject(
    new Error('This method must be called from the browser')
  )
}
