import { useQuery } from "react-query";
import { deserializeEvent, fetchEvent } from "../../api/events";

export const useEventInfo = (id, options = {}) =>
  useQuery(
    ["eventInfo", id],
    () => fetchEvent(id).then(deserializeEvent),
    options
  );

export default useEventInfo;
