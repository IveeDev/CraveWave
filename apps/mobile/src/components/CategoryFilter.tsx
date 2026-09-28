import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export const ALL_CATEGORIES = "all";

type CategoryChip = { id: string; name: string };

type CategoryFilterProps = {
  categories: CategoryChip[];
  counts: Record<string, number>;
  totalCount: number;
  activeId: string;
  onSelect: (id: string) => void;
  onAddCategoryPress: () => void;
  onManagePress?: () => void;
};

const CategoryFilter = ({
  categories,
  counts,
  totalCount,
  activeId,
  onSelect,
  onAddCategoryPress,
  onManagePress,
}: CategoryFilterProps) => {
  const chips = [
    { id: ALL_CATEGORIES, name: "All", count: totalCount },
    ...categories.map((c) => ({ ...c, count: counts[c.id] ?? 0 })),
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>FILTER BY CATEGORY</Text>

        <View style={styles.actions}>
          {onManagePress && (
            <Pressable
              style={styles.action}
              onPress={onManagePress}
              hitSlop={8}
            >
              <Ionicons
                name="pricetag-outline"
                size={14}
                color={colors.text.secondary}
              />
              <Text style={styles.manageText}>Manage</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.action}
            onPress={onAddCategoryPress}
            hitSlop={8}
          >
            <Ionicons name="add" size={16} color="#E17117" />
            <Text style={styles.addText}>Add Category</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {chips.map((chip) => {
          const isActive = chip.id === activeId;

          return (
            <Pressable
              key={chip.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(chip.id)}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {chip.name}
              </Text>

              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text
                  style={[styles.badgeText, isActive && styles.badgeTextActive]}
                >
                  {chip.count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;

const styles = StyleSheet.create({
  wrapper: { gap: 12, marginBottom: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.text.muted,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 16 },
  action: { flexDirection: "row", alignItems: "center", gap: 4 },
  manageText: { fontSize: 13, fontWeight: "600", color: colors.text.secondary },
  addText: { fontSize: 13, fontWeight: "700", color: "#E17117" },
  chips: { gap: 8, paddingRight: 20 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: "#FFF",
  },
  chipActive: { backgroundColor: "#0F172A", borderColor: "#0F172A" },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.text.primary },
  chipTextActive: { color: "#FFF" },
  badge: {
    minWidth: 22,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.subtle,
  },
  badgeActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  badgeText: { fontSize: 11, fontWeight: "700", color: colors.text.secondary },
  badgeTextActive: { color: "#FFF" },
});
