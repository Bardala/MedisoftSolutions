import { QueryClient } from "@tanstack/react-query";

export function getCachedEntities<T extends { id?: number }>(
  queryKey: string,
  ids: number[],
  queryClient: QueryClient,
): T[] {
  return ids
    .map((id) => queryClient.getQueryData<T>([queryKey, id]))
    .filter(Boolean) as T[];
}
