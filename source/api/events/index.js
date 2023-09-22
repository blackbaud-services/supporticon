import dayjs from 'dayjs';

import { get, post } from '../../utils/client';
import jsonDate from '../../utils/jsonDate';
import { required } from '../../utils/params';

export const deserializeEvent = (event) => {
  return {
    ...event,
    completionDate: jsonDate(event.completionDate),
    expiryDate: jsonDate(event.expiryDate),
    startDate: jsonDate(event.startDate),
  };
};

export const fetchEvent = ({ id = required() }) => get(`/v1/event/${id}`);

export const createEvent = ({
  completionDate = required(),
  charityId,
  description,
  eventType = 'OtherCelebration',
  expiryDate = required(),
  isConsumerCreated = true,
  location,
  name = required(),
  startDate = required(),
}) =>
  post('/v1/event', {
    completionDate: dayjs(completionDate).format('YYYY-MM-DD'),
    charityId,
    description,
    eventType,
    expiryDate: dayjs(expiryDate).format('YYYY-MM-DD'),
    isConsumerCreated,
    location,
    name,
    startDate: dayjs(startDate).format('YYYY-MM-DD'),
  });
