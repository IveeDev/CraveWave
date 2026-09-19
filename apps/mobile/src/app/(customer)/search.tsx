import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomerSearchScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Search Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomerSearchScreen;

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
