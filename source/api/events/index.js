import dayjs from 'dayjs'
import { get } from '../../utils/client'
import { required } from '../../utils/params'

const formatUnixString = time =>
  Number(
    time
      .replace('/Date(', '')
      .replace('+0000', '')
      .replace(')/', '')
  )

export const deserializeEvent = event => {
  return {
    ...event,
    completionDate: dayjs(formatUnixString(event.completionDate)).format(),
    expiryDate: dayjs(formatUnixString(event.expiryDate)).format(),
    startDate: dayjs(formatUnixString(event.startDate)).format()
  }
}

export const fetchEvent = ({ id = required() }) => get(`v1/event/${id}`)
