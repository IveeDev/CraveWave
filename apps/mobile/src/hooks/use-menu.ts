import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  menuApi,
  menuKeys,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
} from "@/lib/api/menu";

export const useMenuItems = (restaurantId: string) => {
  return useQuery({
    queryKey: menuKeys.byRestaurant(restaurantId),
    queryFn: () => menuApi.findItemsByRestaurant(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateMenuItemPayload) => menuApi.createItem(dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: menuKeys.all,
      });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMenuItemPayload }) =>
      menuApi.updateItem(id, dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: menuKeys.all,
      });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuApi.removeItem(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: menuKeys.all,
      });
    },
  });
};
