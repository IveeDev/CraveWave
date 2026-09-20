import { useQuery } from "@tanstack/react-query";
import {
  restaurantsApi,
  restaurantKeys,
} from "@/lib/api/restaurants";

export function useMyRestaurant() {
  return useQuery({
    queryKey: restaurantKeys.mine,
    queryFn: restaurantsApi.findMine,
  });
}