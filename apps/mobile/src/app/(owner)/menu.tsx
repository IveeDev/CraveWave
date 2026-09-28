import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import AddDishModal, { DishFormValues } from "@/components/AddDishModal";
import CustomButton from "@/components/CustomButton";
import AddCategoryModal from "@/components/AddCategoryModal";
import { useCategory, useCreateCategory } from "@/hooks/use-category";
import {
  useCreateMenuItem,
  useMenuItems,
  useUpdateMenuItem,
} from "@/hooks/use-menu";
import { useMyRestaurant } from "@/hooks/use-restaurant";
import CategoryFilter, { ALL_CATEGORIES } from "@/components/CategoryFilter";
import MenuItemCard from "@/components/MenuItemCard";
import EmptyMenuState from "@/components/EmptyMenuState";
import { MenuItemType } from "@food-delivery/types";

const MenuScreen = () => {
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] =
    useState<string>(ALL_CATEGORIES);

  const { data: restaurant, isPending: isRestaurantPending } =
    useMyRestaurant();
  const { data: categories = [], isPending: isCategoriesPending } = useCategory(
    restaurant?.id!,
  );
  const { data: items = [] } = useMenuItems(restaurant?.id!);

  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();
  const { mutate: createMenuItem, isPending: isCreatingDish } =
    useCreateMenuItem();
  const { mutate: updateMenuItem, isPending: isUpdatingDish } =
    useUpdateMenuItem();

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    items.forEach((item) => {
      result[item.categoryId] = (result[item.categoryId] ?? 0) + 1;
    });
    return result;
  }, [items]);

  const categoryNameById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const visibleItems =
    activeCategoryId === ALL_CATEGORIES
      ? items
      : items.filter((item) => item.categoryId === activeCategoryId);

  const activeCategoryName =
    activeCategoryId === ALL_CATEGORIES
      ? undefined
      : categoryNameById[activeCategoryId];

  const handleAddCategory = (name: string) => {
    createCategory(
      { name },
      {
        onSuccess: (category) => {
          setIsCategoryModalOpen(false);
          setActiveCategoryId(category.id); // jump straight to the new (empty) category
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;
          Alert.alert(
            "Could not create category",
            Array.isArray(message)
              ? message[0]
              : (message ?? "Something went wrong."),
          );
        },
      },
    );
  };

  function showApiError(title: string, error: any) {
    const message = error?.response?.data?.message;
    Alert.alert(
      title,
      Array.isArray(message)
        ? message[0]
        : (message ?? "Something went wrong. Please try again."),
    );
  }

  function parseDishForm(values: DishFormValues) {
    const price = Number(values.price);

    if (Number.isNaN(price) || price <= 0) {
      Alert.alert("Invalid price", "Please enter a valid price.");
      return null;
    }

    return {
      name: values.name,
      categoryId: values.categoryId,
      imageUrl: values.imageUrl ?? undefined,
      price: price.toFixed(2),
      prepTime: values.prepTime ? Number(values.prepTime) : 0,
    };
  }

  function handleSubmitDish(values: DishFormValues) {
    const base = parseDishForm(values);
    if (!base) return;

    if (editingItem) {
      updateMenuItem(
        {
          id: editingItem.id,
          dto: {
            ...base,
            description: values.description, // "" is allowed, so the owner can clear it
            isAvailable: values.isAvailable,
          },
        },
        {
          onSuccess: closeDishModal,
          onError: (error) => showApiError("Could not update dish", error),
        },
      );
      return;
    }

    createMenuItem(
      { ...base, description: values.description || undefined },
      {
        onSuccess: closeDishModal,
        onError: (error) => showApiError("Could not create dish", error),
      },
    );
  }

  function closeDishModal() {
    setIsDishModalOpen(false);
    setEditingItem(null);
  }

  if (isRestaurantPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E17117" />
        </View>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Create your restaurant first to start building your menu.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Menu & Inventory</Text>
          <Text style={styles.subtitle}>
            {items.length} {items.length === 1 ? "dish" : "dishes"} across{" "}
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </Text>
        </View>

        <CustomButton
          title="New Dish"
          variant="primary"
          IconLeft={({ color, size }) => (
            <Ionicons name="add" size={size} color={color} />
          )}
          onPress={() => setIsDishModalOpen(true)}
          style={styles.button}
        />
      </View>

      <CategoryFilter
        categories={categories}
        counts={counts}
        totalCount={items.length}
        activeId={activeCategoryId}
        onSelect={setActiveCategoryId}
        onAddCategoryPress={() => setIsCategoryModalOpen(true)}
      />

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            categoryName={categoryNameById[item.categoryId]}
            onEditPress={setEditingItem}
          />
        )}
        ListEmptyComponent={
          <EmptyMenuState
            categoryName={activeCategoryName}
            onAddDish={() => setIsDishModalOpen(true)}
          />
        }
      />

      <AddDishModal
        visible={isDishModalOpen || !!editingItem}
        onClose={closeDishModal}
        item={editingItem}
        categories={categories}
        defaultCategoryId={
          activeCategoryId === ALL_CATEGORIES ? null : activeCategoryId
        }
        onAddCategoryPress={() => setIsCategoryModalOpen(true)}
        isSubmitting={isCreatingDish || isUpdatingDish}
        onSubmit={handleSubmitDish}
      />

      <AddCategoryModal
        visible={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleAddCategory}
        isLoading={isCreatingCategory}
      />
    </SafeAreaView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 36,
    paddingHorizontal: 20,
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 15,
    color: colors.text.muted,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.slate[900],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#E17117",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
    height: 40,
  },

  subtitle: { fontSize: 12, color: colors.text.muted, marginTop: 2 },
  list: { gap: 12, paddingBottom: 32 },
});
