import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FormInput from "@/components/FormInput";
import CustomButton from "@/components/CustomButton";
import { colors } from "@/constants/theme";

const CATEGORY_SUGGESTIONS = [
  { label: "Desserts & Sweets", emoji: "🍰" },
  { label: "Appetizers & Starters", emoji: "🥟" },
  { label: "Craft Drinks & Shakes", emoji: "🥤" },
  { label: "Combos & Meal Deals", emoji: "🍱" },
  { label: "Salads & Greens", emoji: "🥗" },
  { label: "Kids Menu", emoji: "🧒" },
  { label: "Chef's Specials", emoji: "⭐" },
  { label: "Sides & Dips", emoji: "🍟" },
];

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading: boolean;
};

const AddCategoryModal = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
}: AddCategoryModalProps) => {
  const [name, setName] = useState("");

  const handleClose = () => {
    setName(""); // so the input is empty next time it opens
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(name.trim());
    setName("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <Ionicons name="folder-outline" size={18} color="#E17117" />
            </View>

            <View style={styles.headerText}>
              <Text style={styles.title}>Add Menu Category</Text>
              <Text style={styles.subtitle}>
                Organize your dishes on the menu
              </Text>
            </View>

            <Pressable onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={colors.text.muted} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <FormInput
            label="Category Title"
            required
            placeholder="e.g. Desserts, Craft Cocktails, Chef Tasting"
            value={name}
            onChangeText={setName}
          />

          {/* Suggestions */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsLabel}>
              POPULAR CATEGORY SUGGESTIONS
            </Text>

            <View style={styles.chipsWrap}>
              {CATEGORY_SUGGESTIONS.map((item) => (
                <Pressable
                  key={item.label}
                  style={styles.chip}
                  onPress={() => setName(item.label)}
                >
                  <Text style={styles.chipText}>
                    {item.label} {item.emoji}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="Cancel"
              variant="outline"
              onPress={handleClose}
              style={styles.actionButton}
            />
            <CustomButton
              title="Add Category"
              onPress={handleSubmit}
              disabled={!name.trim()}
              loading={isLoading}
              IconLeft={({ color, size }) => (
                <Ionicons name="add" size={size} color={color} />
              )}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#FFF",
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FEF3E8",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.DEFAULT,
  },
  suggestionsSection: {
    gap: 10,
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.muted,
    letterSpacing: 0.5,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: colors.background.subtle,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
