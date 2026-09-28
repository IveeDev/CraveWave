import { api } from "@/lib/axios";
import { MenuItemType } from "@food-delivery/types";

export type CreateMenuItemPayload = {
  name: string;
  description?: string;
  price: string;
  categoryId?: string;
  imageUrl?: string;
  prepTime: number;
};

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload> & {
  isAvailable?: boolean;
};

export const menuApi = {
  createItem: (dto: CreateMenuItemPayload) =>
    api.post<MenuItemType>("/menu/items", dto).then((res) => res.data),

  findItemsByRestaurant: (restaurantId: string) =>
    api
      .get<MenuItemType[]>(`/menu/items/${restaurantId}`)
      .then((res) => res.data),

  updateItem: (id: string, dto: UpdateMenuItemPayload) =>
    api.patch<MenuItemType>(`/menu/items/${id}`, dto).then((res) => res.data),

  removeItem: (id: string) =>
    api.delete(`/menu/items/${id}`).then((res) => res.data),
};

export const menuKeys = {
  all: ["menu-items"] as const,

  byRestaurant: (restaurantId: string) =>
    ["menu-items", "restaurant", restaurantId] as const,
};
