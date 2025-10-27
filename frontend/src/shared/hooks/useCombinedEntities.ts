import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCachedEntities } from "@/utils";

type QueryData<T> = {
  data?: T[];
};

export function useCombineCachedAndFetchedEntities<T>(
  queryKey: string,
  ids: number[],
  batchQuery: QueryData<T>,
): T[] {
  const queryClient = useQueryClient();

  return useMemo(() => {
    const cached = getCachedEntities<T>(queryKey, ids, queryClient);
    const fetched = batchQuery.data || [];
    return [...cached, ...fetched];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, ids, batchQuery.data]);
}
