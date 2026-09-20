import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PayoutBanner() {
  return (
    <View style={styles.container}>
      <Ionicons name="shield-checkmark" size={20} color="#10B981" />

      <View style={styles.textBlock}>
        <Text style={styles.title}>Direct Merchant Payouts Active</Text>

        <Text style={styles.subtitle}>
          Earnings are deposited daily. You can manage banking preferences
          anytime in Settings.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },

  textBlock: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
