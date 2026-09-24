import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getToken } from "./auth";

// Dynamically get the dev server host (works on any network)
const getBaseUrl = () => {
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const host = debuggerHost?.split(":")[0]; // strip the port
    if (host) return `http://${host}:3000/api/v1`;
  }
  // Production fallback
  return process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
