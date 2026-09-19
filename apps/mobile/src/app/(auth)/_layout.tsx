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
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthLayout;
