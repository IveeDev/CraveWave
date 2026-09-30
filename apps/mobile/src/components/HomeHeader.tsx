import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";

type HomeHeaderProps = {
  locationLabel: string; // "Home", "Work"...
  address: string;
  notificationCount?: number;
  onLocationPress?: () => void;
  onNotificationsPress?: () => void;
};

const HomeHeader = ({
  locationLabel,
  address,
  notificationCount = 0,
  onLocationPress,
  onNotificationsPress,
}: HomeHeaderProps) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.location} onPress={onLocationPress}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={18} color={colors.primary.DEFAULT} />
        </View>

        <View style={styles.locationText}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{locationLabel}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.text.muted} />
          </View>

          <Text style={styles.address} numberOfLines={1}>
            {address}
          </Text>
        </View>
      </Pressable>

      <Pressable style={styles.bell} onPress={onNotificationsPress} hitSlop={8}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={colors.text.primary}
        />

        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? "9+" : notificationCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  location: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary.light,
  },
  locationText: { flex: 1 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  label: { fontSize: 15, fontWeight: "700", color: colors.text.primary },
  address: { fontSize: 12, color: colors.text.muted, marginTop: 1 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.subtle,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary.DEFAULT,
  },
  badgeText: { fontSize: 9, fontWeight: "800", color: "#FFF" },
});
