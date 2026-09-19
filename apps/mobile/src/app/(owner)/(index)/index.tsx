import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RestaurantType } from "@food-delivery/types";
import { api } from "@/lib/axios";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const OwnerKitchenScreen = () => {
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading } = useQuery<RestaurantType | null>({
    queryKey: ["my-restaurant"],
    queryFn: () =>
      api
        .get<RestaurantType | null>("/restaurants/mine")
        .then((res) => res.data),
  });

  const { mutate: toggleIsAcceptingOrders } = useMutation({
    mutationFn: () =>
      api.patch(`/restaurants/${restaurant?.id}`, {
        isAcceptingOrders: !restaurant?.isAcceptingOrders,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
    },
  });

  useEffect(() => {
    if (isLoading) return;
    if (!restaurant) {
      router.replace("/(owner)/(index)/create-restaurant");
    }
  }, [isLoading, restaurant, router]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color={"#0000ff"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>{restaurant?.name}</Text>

        <Pressable
          onPress={() => toggleIsAcceptingOrders()}
          style={styles.statusButton}
        >
          <Text style={styles.statusText}>
            {restaurant?.isAcceptingOrders
              ? "Open - tap to close"
              : "Close - tap to open"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/(owner)/(index)/edit-restaurant")}
        >
          <Text style={styles.editText}>Edit Restaurant</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OwnerKitchenScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingTop: 36,
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusButton: {
    backgroundColor: "#1F2937",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  statusText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#1F2937",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  editText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
});
