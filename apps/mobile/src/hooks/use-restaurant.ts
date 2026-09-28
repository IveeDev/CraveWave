import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  restaurantsApi,
  restaurantKeys,
  CreateRestaurantPayload,
  UpdateRestaurantPayload,
} from "@/lib/api/restaurants";

export function useRestaurants() {
  return useQuery({
    queryKey: restaurantKeys.all,
    queryFn: restaurantsApi.findAll,
  });
}

export function useRestaurant(id?: string) {
  return useQuery({
    queryKey: restaurantKeys.detail(id!),
    queryFn: () => restaurantsApi.findById(id!),
    enabled: !!id,
  });
}

export function useMyRestaurant() {
  return useQuery({
    queryKey: restaurantKeys.mine,
    queryFn: restaurantsApi.findMine,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRestaurantPayload) => restaurantsApi.create(dto),

    onSuccess: (restaurant) => {
      queryClient.setQueryData(restaurantKeys.mine, restaurant);

      queryClient.invalidateQueries({
        queryKey: restaurantKeys.all,
      });
    },
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRestaurantPayload }) =>
      restaurantsApi.update(id, dto),

    onSuccess: (restaurant) => {
      queryClient.setQueryData(
        restaurantKeys.detail(restaurant.id),
        restaurant,
      );

      queryClient.setQueryData(restaurantKeys.mine, restaurant);

      queryClient.invalidateQueries({
        queryKey: restaurantKeys.all,
      });
    },
  });
}
