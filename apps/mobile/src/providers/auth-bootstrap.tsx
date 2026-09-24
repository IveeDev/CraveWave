import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export const AuthBootstrap = () => {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const checkOnboarding = useAuthStore((state) => state.checkOnboarding);

  useEffect(() => {
    const bootstrap = async () => {
      await Promise.all([restoreSession(), checkOnboarding()]);
    };

    bootstrap();
  }, [restoreSession, checkOnboarding]);

  return null;
};
