import { Redirect } from "expo-router";
import { UserRole } from "@food-delivery/types";
import { useAuthStore } from "@/store/auth-store";

export default function Index() {
  const { isLoading, user, hasCompletedOnboarding } = useAuthStore();

  // Still checking session/onboarding
  if (isLoading || hasCompletedOnboarding === null) {
    return null;
  }

  // Brand-new user
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  // Onboarding completed, but user isn't logged in
  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
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
