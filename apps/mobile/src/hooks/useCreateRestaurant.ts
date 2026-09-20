import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restaurantsApi, restaurantKeys } from "@/lib/api/restaurants";

export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restaurantsApi.create,

    onSuccess: (restaurant) => {
      queryClient.setQueryData(restaurantKeys.mine, restaurant);
    },
  });
}
