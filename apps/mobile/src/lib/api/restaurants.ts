import { api } from "@/lib/axios";
import { RestaurantType } from "@food-delivery/types";

export type CreateRestaurantPayload = {
  name: string;
  description?: string;
  address: string;
  kitchenPhone?: string;
  prepTimeMinutes: number;
  imageUrl?: string;
  cuisineIds: string[];
};

export type UpdateRestaurantPayload = Partial<CreateRestaurantPayload> & {
  isAcceptingOrders?: boolean;
};

export const restaurantsApi = {
  create: (dto: CreateRestaurantPayload) =>
    api.post<RestaurantType>("/restaurants", dto).then((res) => res.data),

  findAll: () =>
    api.get<RestaurantType[]>("/restaurants").then((res) => res.data),

  findById: (id: string) =>
    api.get<RestaurantType>(`/restaurants/${id}`).then((res) => res.data),

  findMine: () =>
    api.get<RestaurantType | null>("/restaurants/mine").then((res) => res.data),

  update: (id: string, dto: UpdateRestaurantPayload) =>
    api
      .patch<RestaurantType>(`/restaurants/${id}`, dto)
      .then((res) => res.data),
};

export const restaurantKeys = {
  all: ["restaurants"] as const,

  mine: ["restaurants", "mine"] as const,

  detail: (id: string) => ["restaurants", "detail", id] as const,
};
