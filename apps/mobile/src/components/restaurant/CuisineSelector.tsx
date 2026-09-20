import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Cuisine = {
  id: string;
  name: string;
};

interface CuisineSelectorProps {
  cuisines: Cuisine[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading?: boolean;
}

const CuisineSelector = ({
  cuisines,
  selectedIds,
  onChange,
  isLoading = false,
}: CuisineSelectorProps) => {
  function toggleCuisine(cuisineId: string) {
    onChange(
      selectedIds.includes(cuisineId)
        ? selectedIds.filter((id) => id !== cuisineId)
        : [...selectedIds, cuisineId],
    );
  }

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <View style={styles.chipWrap}>
          {cuisines.map((cuisine) => {
            const selected = selectedIds.includes(cuisine.id);

            return (
              <Pressable
                key={cuisine.id}
                onPress={() => toggleCuisine(cuisine.id)}
                style={[
                  styles.cuisineChip,
                  selected && styles.cuisineChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.cuisineChipText,
                    selected && styles.cuisineChipTextSelected,
                  ]}
                >
                  {cuisine.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};
export default CuisineSelector;

const styles = StyleSheet.create({
  loading: {
    marginBottom: 16,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  cuisineChip: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  cuisineChipSelected: {
    backgroundColor: "#FF5A36",
    borderColor: "#FF5A36",
  },

  cuisineChipText: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "600",
  },

  cuisineChipTextSelected: {
    color: "#FFF",
  },
});
