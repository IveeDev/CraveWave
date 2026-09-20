import { api } from "@/lib/axios";
import { Cuisine } from "@food-delivery/types";

export const cuisinesApi = {
  findAll: () => api.get<Cuisine[]>("/cuisines").then((res) => res.data),
};

export const cuisineKeys = {
  all: ["cuisines"] as const,
};
