import { Redirect } from "expo-router";

import { UserRole } from "@food-delivery/types";
import { useAuthStore } from "@/store/auth-store";

export default function Index() {
  const { isLoading, user } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  switch (user.role) {
    case UserRole.CUSTOMER:
      return <Redirect href="/(customer)" />;

    case UserRole.RESTAURANT_OWNER:
      return <Redirect href="/(owner)/(index)" />;

    case UserRole.DRIVER:
      return <Redirect href="/(driver)" />;

    default:
      return <Redirect href="/(auth)/login" />;
  }
}
