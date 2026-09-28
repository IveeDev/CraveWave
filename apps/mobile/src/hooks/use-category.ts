import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  categoryApi,
  categoryKeys,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/lib/api/category";

export const useCategory = (restaurantId: string) => {
  return useQuery({
    queryKey: categoryKeys.byRestaurant(restaurantId),
    queryFn: () => categoryApi.findByRestaurant(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoryPayload) => categoryApi.create(dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryPayload }) =>
      categoryApi.update(id, dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};
