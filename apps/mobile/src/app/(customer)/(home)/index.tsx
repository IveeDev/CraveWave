import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomerHomeScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Home Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomerHomeScreen;

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
});
