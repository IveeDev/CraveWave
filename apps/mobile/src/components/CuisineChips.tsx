import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { getCuisineEmoji } from "@/constants/cuisine";

export const ALL_CUISINES = "all";

type Cuisine = { id: string; name: string };

type CuisineChipsProps = {
  cuisines: Cuisine[];
  activeId: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
};

const CuisineChips = ({
  cuisines,
  activeId,
  onSelect,
  isLoading,
}: CuisineChipsProps) => {
  const chips = [
    { id: ALL_CUISINES, name: "All", emoji: "🍽️" },
    ...cuisines.map((c) => ({ ...c, emoji: getCuisineEmoji(c.name) })),
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>FOOD CATEGORIES</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {isLoading
          ? [0, 1, 2, 3].map((i) => <View key={i} style={styles.skeleton} />)
          : chips.map((chip) => {
              const isActive = chip.id === activeId;

              return (
                <Pressable
                  key={chip.id}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => onSelect(chip.id)}
                >
                  <Text style={styles.emoji}>{chip.emoji}</Text>
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {chip.name}
                  </Text>
                </Pressable>
              );
            })}
      </ScrollView>
    </View>
  );
};

export default CuisineChips;

const styles = StyleSheet.create({
  // Cancel the screen's 20px side padding so chips scroll edge-to-edge…
  wrapper: { gap: 12, marginHorizontal: -20 },
  label: {
    marginHorizontal: 20,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: colors.text.muted,
  },
  // …then put the 20px back so the first chip lines up with the rest of the page
  chips: { gap: 8, paddingHorizontal: 20 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: "#FFF",
  },
  chipActive: { backgroundColor: "#0F172A", borderColor: "#0F172A" },
  emoji: { fontSize: 16 },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.text.primary },
  chipTextActive: { color: "#FFF" },
  skeleton: {
    width: 88,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.background.subtle,
  },
});
