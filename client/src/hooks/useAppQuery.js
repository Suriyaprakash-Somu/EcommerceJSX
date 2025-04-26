import { useQuery } from "@tanstack/react-query";

export function useAppQuery(queryKey, queryFn, options = {}) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 0,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    ...options,
  });
}
