import { api } from "@/lib/axios";
import { CategoryType } from "@food-delivery/types";

export type CreateCategoryPayload = {
  name: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export const categoryApi = {
  create: (dto: CreateCategoryPayload) =>
    api.post<CategoryType>("/menu/categories", dto).then((res) => res.data),

  findByRestaurant: (restaurantId: string) =>
    api
      .get<CategoryType[]>(`/menu/categories/${restaurantId}`)
      .then((res) => res.data),

  update: (id: string, dto: UpdateCategoryPayload) =>
    api
      .patch<CategoryType>(`/menu/categories/${id}`, dto)
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete(`/menu/categories/${id}`).then((res) => res.data),
};

export const categoryKeys = {
  all: ["categories"] as const,

  byRestaurant: (restaurantId: string) =>
    ["categories", "restaurant", restaurantId] as const,
};
