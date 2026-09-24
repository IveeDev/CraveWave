import { useAuthStore } from "@/store/auth-store";
import { Stack } from "expo-router";

const AuthLayout = () => {
  const { isLoading } = useAuthStore();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
};

export default AuthLayout;
