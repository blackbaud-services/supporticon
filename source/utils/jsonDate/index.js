import dayjs from 'dayjs'

export default date => dayjs.isDayjs(dayjs(date)) && dayjs(date).toISOString()
