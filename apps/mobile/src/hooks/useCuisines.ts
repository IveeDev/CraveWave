import { useQuery } from "@tanstack/react-query";
import { cuisinesApi, cuisineKeys } from "@/lib/api/cuisines";

export function useCuisines() {
  return useQuery({
    queryKey: cuisineKeys.all,
    queryFn: cuisinesApi.findAll,
  });
}
