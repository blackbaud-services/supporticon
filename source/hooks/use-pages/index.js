import pickBy from "lodash/pickBy";
import sortBy from "lodash/sortBy";
import { useQuery } from "@tanstack/react-query";
import { fetchPages, deserializePage } from "../../api/pages";

export const usePages = (params, options) => {
  const { deserializeMethod, refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: [
      "pages",
      pickBy({
        allPages: params.allPages,
        campaign: params.campaign,
        charity: params.charity,
        event: params.event,
        ids: params.ids,
        limit: params.limit,
        q: params.q,
        userPages: params.userPages,
      }),
    ],
    queryFn: () =>
      fetchPages(params)
        .then((results) =>
          params.ids
            ? sortBy(results, (result) => params.ids.indexOf(result.pageGuid))
            : results
        )
        .then((results) => results.map(deserializeMethod || deserializePage)),
    options: {
      refetchInterval,
      staleTime,
    },
  });
};

export default usePages;
