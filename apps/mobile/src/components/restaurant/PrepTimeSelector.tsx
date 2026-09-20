import { Pressable, StyleSheet, Text, View } from "react-native";

interface PrepTimeSelectorProps {
  value: number;
  options: readonly number[];
  onChange: (value: number) => void;
}

export function PrepTimeSelector({
  value,
  options,
  onChange,
}: PrepTimeSelectorProps) {
  return (
    <View style={styles.container}>
      {options.map((minutes) => {
        const selected = value === minutes;

        return (
          <Pressable
            key={minutes}
            onPress={() => onChange(minutes)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {minutes}m
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },

  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9999,
    paddingVertical: 10,
    alignItems: "center",
  },

  chipSelected: {
    backgroundColor: "#FF5A36",
    borderColor: "#FF5A36",
  },

  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },

  textSelected: {
    color: "#FFF",
  },
});
