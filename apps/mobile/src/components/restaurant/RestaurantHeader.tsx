import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function RestaurantHeader() {
  return (
    <View style={styles.container}>
      <Ionicons name="sparkles" size={16} color="#FFF" />

      <Text style={styles.text}>Kitchen Setup Portal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF5A36",
    paddingVertical: 14,
  },

  text: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
