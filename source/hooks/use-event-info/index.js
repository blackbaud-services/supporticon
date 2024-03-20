import { useQuery } from "@tanstack/react-query";
import { deserializeEvent, fetchEvent } from "../../api/events";

export const useEventInfo = (id, options = {}) =>
  useQuery({
    queryKey: ["eventInfo", id],
    queryFn: () => fetchEvent(id).then(deserializeEvent),
    options: options,
  });

export default useEventInfo;
