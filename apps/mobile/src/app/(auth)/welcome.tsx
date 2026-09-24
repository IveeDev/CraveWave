import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing } from "@/constants/theme";
import { router } from "expo-router";
import logo from "@/assets/images/logo.png";
import kitchenImage from "@/assets/images/kitchen.png";
import bikeImage from "@/assets/images/bicycle.png";
import shoppingBag from "@/assets/images/shopping-bag.png";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { api } from "@/lib/axios";

const ROLE_HIGHLIGHTS = [
  { label: "Customer", caption: "Order Food", image: shoppingBag },
  { label: "Kitchen", caption: "Manage KDS", image: kitchenImage },
  { label: "Driver", caption: "Earn & Deliver", image: bikeImage },
];

function ArrowIcon({ color, size }: { color: string; size: number }) {
  return <Ionicons name="arrow-forward" size={size} color={color} />;
}
const [apiStatus, setApiStatus] = React.useState("Not tested");

async function testApiConnection() {
  try {
    setApiStatus("Connecting...");

    const response = await api.get("/health");

    console.log("API RESPONSE:", response.data);

    setApiStatus(`Connected: ${JSON.stringify(response.data)}`);

    Alert.alert(
      "API Connected",
      `Status: ${response.status}\n${JSON.stringify(response.data)}`,
    );
  } catch (error: any) {
    console.error("API CONNECTION ERROR:", error);

    setApiStatus(
      `Failed: ${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`,
    );

    Alert.alert(
      "API Connection Failed",
      error?.response
        ? `HTTP ${error.response.status}\n${JSON.stringify(
            error.response.data,
          )}`
        : error?.message || "Could not connect to API",
    );
  }
}

const Welcome = () => {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.topRow}>
        <Text style={styles.brandLabel}>CRAVEWAVE MOBILE</Text>
        <Pressable onPress={() => router.push("/onboarding")}>
          <Text style={styles.viewOnboarding}>View Onboarding</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrapper}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        </View>

        <Text style={styles.headline}>
          Delicious food,{"\n"}
          <Text style={styles.headlineAccent}>delivered fast.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Join CraveWave to discover top restaurants, manage your kitchen, or
          deliver on your own schedule.
        </Text>

        <View style={styles.highlightRow}>
          {ROLE_HIGHLIGHTS.map((item) => (
            <View key={item.label} style={styles.highlightCard}>
              <Image
                source={item.image}
                style={styles.highlightIcon}
                resizeMode="contain"
              />
              <Text style={styles.highlightLabel}>{item.label}</Text>
              <Text style={styles.highlightCaption}>{item.caption}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonGroup}>
          <CustomButton
            title="Log In"
            variant="primary"
            IconRight={ArrowIcon}
            onPress={() => router.push("/(auth)/login")}
          />
          <CustomButton
            title="Create Account"
            variant="outline"
            onPress={() => router.push("/(auth)/register")}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing["2xl"],
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
  },
  brandLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary.DEFAULT,
    letterSpacing: 1,
  },
  viewOnboarding: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: "600",
  },
  content: { paddingBottom: spacing.xl, alignItems: "center" },

  logoWrapper: { marginTop: 100, marginBottom: spacing.lg },

  logoImage: { width: 200, height: 100 },

  headline: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 34,
  },
  headlineAccent: { color: colors.primary.DEFAULT },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },

  highlightRow: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
    marginTop: 30,
    marginBottom: spacing.xl,
  },
  highlightCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  highlightIcon: { width: 28, height: 28, marginBottom: spacing.xs },
  highlightLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },
  highlightCaption: { fontSize: 11, color: colors.text.muted, marginTop: 2 },

  buttonGroup: { width: "100%", marginTop: 70 },
});
