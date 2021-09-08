import { get } from '../../utils/client'
import { required } from '../../utils/params'

export const createQrCode = (
  linkUrl = required(),
  logoUrl = 'https://images.justgiving.com/image/f468c25c-93e5-4e2d-bcb9-eb525559fb43.jpg'
) => {
  return get('/v1/qrcodes/create', { linkUrl, logoUrl })
}
