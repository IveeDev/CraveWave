import { Ionicons } from "@expo/vector-icons";
import { UserRole } from "@food-delivery/types";

export type RoleConfig = {
  value: UserRole;
  label: string;
  badge: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  accentLight: string;
  cardBg: string;
};

export const ROLES: RoleConfig[] = [
  {
    value: UserRole.CUSTOMER,
    label: "Customer",
    badge: "Order & Enjoy",
    description:
      "Discover restaurants, order your favorite meals, and get them delivered to your door.",
    icon: "person-outline",
    accent: "#F0653C",
    accentLight: "#FDE7DF",
    cardBg: "#FFF4F0",
  },
  {
    value: UserRole.RESTAURANT_OWNER,
    label: "Restaurant Owner",
    badge: "Kitchen KDS & Sales",
    description: "Manage your restaurant, menu, orders, and sales.",
    icon: "storefront-outline",
    accent: "#E08A00",
    accentLight: "#FDECC8",
    cardBg: "#FFF8EA",
  },
  {
    value: UserRole.DRIVER,
    label: "Delivery Partner",
    badge: "Flexible Earnings",
    description:
      "Deliver orders, manage deliveries, and earn money on your schedule.",
    icon: "bicycle-outline",
    accent: "#189B63",
    accentLight: "#D8F3E6",
    cardBg: "#F1FBF6",
  },
];
