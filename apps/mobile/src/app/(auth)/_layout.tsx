import { useAuthStore } from "@/store/auth-store";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
  const { isLoading, user } = useAuthStore();

  if (isLoading) return null;
  if (user) return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
