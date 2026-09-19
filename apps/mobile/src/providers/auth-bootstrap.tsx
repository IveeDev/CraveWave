import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

export const AuthBootstrap = () => {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return null;
};
