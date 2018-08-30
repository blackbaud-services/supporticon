import moment from 'moment'

export default date =>
  moment.isMoment(moment(date)) && moment(date).toISOString()
