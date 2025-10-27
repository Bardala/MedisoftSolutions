import { QueryClient } from "@tanstack/react-query";

export function findMissingIds(
  queryClient: QueryClient,
  queryKey: string,
  ids: number[],
): number[] {
  return ids.filter((id) => !queryClient.getQueryData([queryKey, id]));
}
