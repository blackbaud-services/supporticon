import { servicesAPI } from "../../utils/client";
import { required } from "../../utils/params";
import jsonDate from "../../utils/jsonDate";
import dayjs from "dayjs";

export const deserializeEvent = (event) => {
  return {
    ...event,
    completionDate: jsonDate(event.completionDate),
    expiryDate: jsonDate(event.expiryDate),
    startDate: jsonDate(event.startDate),
  };
};

export const fetchEvent = ({ id = required() }) =>
  servicesAPI.get(`/v1/event/${id}`).then(({ data }) => data);

export const createEvent = ({
  completionDate = required(),
  charityId,
  description,
  eventType = "OtherCelebration",
  expiryDate = required(),
  isConsumerCreated = true,
  location,
  name = required(),
  startDate = required(),
}) => {
  return servicesAPI
    .post("/v1/event", {
      completionDate: dayjs(completionDate).format("YYYY-MM-DD"),
      charityId,
      description,
      eventType,
      expiryDate: dayjs(expiryDate).format("YYYY-MM-DD"),
      isConsumerCreated,
      location,
      name,
      startDate: dayjs(startDate).format("YYYY-MM-DD"),
    })
    .then(({ data }) => data);
};

export const fetchEventTotalRaised = ({ id = required() }) =>
  servicesAPI.get(`v1/event/${id}/total`).then(({ data }) => data.totalRaised);
