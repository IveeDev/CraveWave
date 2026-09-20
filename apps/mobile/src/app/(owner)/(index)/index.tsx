import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMyRestaurant } from "@/hooks/useMyRestaurant";
import { useToggleRestaurantOrders } from "@/hooks/useToggleRestaurantOrders";

const OwnerKitchenScreen = () => {
  const { data: restaurant, isLoading } = useMyRestaurant();

  const { mutate: toggleIsAcceptingOrders, isPending: isTogglingOrders } =
    useToggleRestaurantOrders();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!restaurant) {
      router.replace("/(owner)/(index)/create-restaurant");
    }
  }, [isLoading, restaurant]);

  if (isLoading || !restaurant) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5A36" />
      </View>
    );
  }

  function handleToggleOrders() {
    toggleIsAcceptingOrders({
      restaurantId: restaurant!.id,
      isAcceptingOrders: !restaurant!.isAcceptingOrders,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>{restaurant.name}</Text>

        <Pressable
          onPress={handleToggleOrders}
          disabled={isTogglingOrders}
          style={[
            styles.statusButton,
            restaurant.isAcceptingOrders
              ? styles.statusButtonOpen
              : styles.statusButtonClosed,
            isTogglingOrders && styles.disabledButton,
          ]}
        >
          {isTogglingOrders ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.statusText}>
              {restaurant.isAcceptingOrders
                ? "Open - tap to close"
                : "Closed - tap to open"}
            </Text>
          )}
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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

  disabledButton: {
    opacity: 0.6,
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

  statusButtonOpen: {
    backgroundColor: "#16A34A",
  },

  statusButtonClosed: {
    backgroundColor: "#DC2626",
  },
});
