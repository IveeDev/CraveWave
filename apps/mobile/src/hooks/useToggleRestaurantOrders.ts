import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantsApi, restaurantKeys } from "@/lib/api/restaurants";

export function useToggleRestaurantOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      restaurantId,
      isAcceptingOrders,
    }: {
      restaurantId: string;
      isAcceptingOrders: boolean;
    }) => {
      return restaurantsApi.update(restaurantId, {
        isAcceptingOrders,
      });
    },

    onSuccess: (restaurant) => {
      queryClient.setQueryData(restaurantKeys.mine, restaurant);
    },
  });
}
