export const UserRole = {
  CUSTOMER: "CUSTOMER",
  RESTAURANT_OWNER: "RESTAURANT_OWNER",
  DRIVER: "DRIVER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: Date;
}

export interface RestaurantType {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  preparationTimeMinutes: number;
  kitchenPhone: string;
  isAcceptingOrders: boolean;
  imageUrl: string;
  cuisineId: string[];
}

export interface Cuisine {
  id: string;
  name: string;
}
