import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { HealthCheckResponse } from "@food-delivery/types";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

const HealthScreen = () => {
  const {
    data: health,
    error,
    isLoading,
  } = useQuery<HealthCheckResponse>({
    queryKey: ["health"],
    queryFn: () =>
      api.get<HealthCheckResponse>("/health").then((res) => res.data),
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Delivery</Text>
      <Text style={styles.subtitle}>Connection Text</Text>

      {isLoading && <ActivityIndicator size="large" color="#ff6b35" />}

      {error && (
        <Text style={{ color: "red" }}>Error while connecting to server.</Text>
      )}

      {health?.status === "ok" ? (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>Connection OK</Text>
          <Text style={styles.statusTimestamp}>
            {new Date(health.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.errorText}>Something went wrong.</Text>
      )}
    </View>
  );
};

export default HealthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },

  statusBox: {
    backgroundColor: "#f0fff4",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },

  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d32",
  },

  statusTimestamp: {
    fontSize: 14,
    color: "#2e7d32",
  },

  errorText: {
    fontSize: 15,
    color: "#e53",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },
});
