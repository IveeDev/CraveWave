import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuickFillTemplate {
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly emoji: string;
}

interface QuickFillTemplatesProps {
  templates: readonly QuickFillTemplate[];
  onSelect: (template: QuickFillTemplate) => void;
}

const QuickFillTemplates = ({
  templates,
  onSelect,
}: QuickFillTemplatesProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Ionicons name="flash" size={18} color="#FF5A36" />

          <Text style={styles.title}>Quick-Fill Kitchen Template</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>1-Tap Setup</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Testing or presenting? Tap any template to auto-fill realistic
        restaurant details and open your kitchen immediately.
      </Text>

      <View style={styles.templateRow}>
        {templates.map((template) => (
          <Pressable
            key={template.id}
            style={styles.templateChip}
            onPress={() => onSelect(template)}
          >
            <Text style={styles.emoji}>{template.emoji}</Text>

            <Text style={styles.chipLabel} numberOfLines={1}>
              {template.label}
            </Text>

            <Text style={styles.chipTag}>{template.tag}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default QuickFillTemplates;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF8F6",
    borderWidth: 1,
    borderColor: "#FFD9CC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  title: {
    fontWeight: "700",
    fontSize: 14,
    color: "#0F172A",
  },

  badge: {
    backgroundColor: "#FFF0ED",
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  badgeText: {
    color: "#E04523",
    fontSize: 11,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },

  templateRow: {
    flexDirection: "row",
    gap: 8,
  },

  templateChip: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    alignItems: "center",
  },

  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },

  chipLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0F172A",
  },

  chipTag: {
    fontSize: 10,
    color: "#94A3B8",
  },
});
