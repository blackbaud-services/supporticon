import { get } from '../../utils/client'
import { required } from '../../utils/params'
import jsonDate from '../../utils/jsonDate'

export const deserializeEvent = event => {
  return {
    ...event,
    completionDate: jsonDate(event.completionDate),
    expiryDate: jsonDate(event.expiryDate),
    startDate: jsonDate(event.startDate)
  }
}

export const fetchEvent = ({ id = required() }) => get(`v1/event/${id}`)
