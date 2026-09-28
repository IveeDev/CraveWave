import { Modal, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FormInput from "@/components/FormInput";
import CustomButton from "@/components/CustomButton";
import { ImagePickerField } from "@/components/ImagePickerField";
import { useImageUpload } from "@/hooks/use-image-upload";
import { colors } from "@/constants/theme";
import { MenuItemType } from "@food-delivery/types";

type Category = { id: string; name: string };

export type DishFormValues = {
  name: string;
  categoryId: string;
  imageUrl: string | null;
  price: string;
  prepTime: string;
  description: string;
  isAvailable: boolean;
};

type AddDishModalProps = {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategoryPress: () => void;
  onSubmit: (values: DishFormValues) => void;
  defaultCategoryId?: string | null;
  item?: MenuItemType | null;
  isSubmitting?: boolean;
};

const AddDishModal = ({
  visible,
  onClose,
  categories,
  onAddCategoryPress,
  onSubmit,
  defaultCategoryId = null,
  item = null,
  isSubmitting,
}: AddDishModalProps) => {
  const [name, setName] = useState("");
  const isEditing = !!item;
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [description, setDescription] = useState("");

  const { uploadImage, isUploading } = useImageUpload("menuItem");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  async function handlePickImage() {
    const url = await uploadImage();
    if (url) setImageUrl(url);
  }

  useEffect(() => {
    if (!visible) return;

    setName(item?.name ?? "");
    setPrice(item ? String(Number(item.price)) : ""); // "2500.00" → "2500"
    setPrepTime(item ? String(item.prepTime) : "");
    setDescription(item?.description ?? "");
    setImageUrl(item?.imageUrl ?? null);
    setIsAvailable(item?.isAvailable ?? true);
    setIsCategoryOpen(false);
    setCategoryId(item?.categoryId ?? defaultCategoryId);
  }, [visible, item?.id]);

  useEffect(() => {
    if (defaultCategoryId && !item) setCategoryId(defaultCategoryId);
  }, [defaultCategoryId]);
  function handleCreate() {
    if (!name.trim() || !categoryId || !price.trim()) return;

    onSubmit({
      name: name.trim(),
      categoryId,
      imageUrl,
      price: price.trim(),
      prepTime: prepTime.trim(),
      description: description.trim(),
      isAvailable,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>
                {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
              </Text>
              <Text style={styles.subtitle}>
                Configure dish details and category
              </Text>
            </View>

            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={colors.text.muted} />
            </Pressable>
          </View>
          {/* Dish name */}
          <FormInput
            label="Dish Name"
            required
            placeholder="e.g. Wagyu Truffle Smash"
            value={name}
            onChangeText={setName}
          />
          {/* Category */}
          <View style={styles.fieldContainer}>
            <View style={styles.categoryLabelRow}>
              <Text style={styles.label}>Category *</Text>

              <Pressable onPress={onAddCategoryPress} hitSlop={8}>
                <Text style={styles.addCategoryLink}>+ Add New Category</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.categorySelect}
              onPress={() => setIsCategoryOpen((prev) => !prev)}
            >
              <Text
                style={
                  selectedCategory
                    ? styles.categorySelectText
                    : styles.categorySelectPlaceholder
                }
              >
                {selectedCategory?.name ?? "Select category"}
              </Text>
              <Ionicons
                name={isCategoryOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.text.muted}
              />
            </Pressable>

            {isCategoryOpen && (
              <View style={styles.categoryDropdown}>
                {categories.length === 0 ? (
                  <Text style={styles.emptyCategoryText}>
                    No categories yet. Tap "+ Add New Category" above.
                  </Text>
                ) : (
                  categories.map((category) => (
                    <Pressable
                      key={category.id}
                      style={styles.categoryOption}
                      onPress={() => {
                        setCategoryId(category.id);
                        setIsCategoryOpen(false);
                      }}
                    >
                      <Text style={styles.categoryOptionText}>
                        {category.name}
                      </Text>
                    </Pressable>
                  ))
                )}
              </View>
            )}
          </View>
          {/* Photo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dish Photo</Text>

            <ImagePickerField
              variant="square"
              imageUrl={imageUrl}
              isUploading={isUploading}
              onPress={handlePickImage}
            />
          </View>
          {/* Price + Prep time */}
          <View style={styles.row}>
            <FormInput
              label="Price (#)"
              required
              placeholder="14.50"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              containerStyle={styles.halfField}
            />

            <FormInput
              label="Prep Time (min)"
              placeholder="12"
              keyboardType="number-pad"
              value={prepTime}
              onChangeText={setPrepTime}
              containerStyle={styles.halfField}
            />
          </View>
          {/* Description */}
          <FormInput
            label="Description"
            placeholder="Ingredients and culinary highlights..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.textarea}
          />
          {isEditing && (
            <View style={styles.availabilityRow}>
              <View>
                <Text style={styles.label}>Available for orders</Text>
                <Text style={styles.subtitle}>
                  Turn off when the dish is sold out
                </Text>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: "#FECACA", true: "#86EFAC" }}
                thumbColor={isAvailable ? "#22C55E" : "#EF4444"}
              />
            </View>
          )}
          {/* Actions */}
          <View style={styles.actionsRow}>
            <CustomButton
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.actionButton}
            />

            <CustomButton
              title={isEditing ? "Save Changes" : "Create Dish"}
              variant="primary"
              loading={isSubmitting}
              onPress={handleCreate}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddDishModal;

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
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },
  categoryLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  availabilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  emptyCategoryText: {
    padding: 14,
    fontSize: 13,
    color: colors.text.muted,
  },
  addCategoryLink: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E17117",
  },
  categorySelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: colors.background.subtle,
  },
  categorySelectText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  categorySelectPlaceholder: {
    fontSize: 14,
    color: colors.text.muted,
  },
  categoryDropdown: {
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: 14,
    overflow: "hidden",
  },
  categoryOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryOptionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  textarea: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
