import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverHome() {
  console.log("DRIVER HOME RENDERED"); // ← the new line

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text>Driver Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
