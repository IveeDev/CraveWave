import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MenuItemType } from "@food-delivery/types";
import { colors } from "@/constants/theme";

type MenuItemCardProps = {
  item: MenuItemType;
  categoryName?: string;
  onEditPress: (item: MenuItemType) => void;
};

const MenuItemCard = ({
  item,
  categoryName,
  onEditPress,
}: MenuItemCardProps) => {
  return (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Ionicons
            name="restaurant-outline"
            size={22}
            color={colors.text.muted}
          />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>#{Number(item.price).toFixed(2)}</Text>
          {item.prepTime > 0 && (
            <Text style={styles.prep}>{item.prepTime} min prep</Text>
          )}
        </View>

        {categoryName && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText} numberOfLines={1}>
              {categoryName}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.side}>
        <Pressable
          style={styles.editButton}
          onPress={() => onEditPress(item)}
          hitSlop={6}
        >
          <Ionicons
            name="pencil-outline"
            size={16}
            color={colors.text.secondary}
          />
        </Pressable>

        <View style={[styles.stock, !item.isAvailable && styles.stockOut]}>
          <Text
            style={[styles.stockText, !item.isAvailable && styles.stockTextOut]}
          >
            {item.isAvailable ? "In Stock" : "Sold Out"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MenuItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: "#FFF",
  },
  image: { width: 60, height: 60, borderRadius: 14 },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.subtle,
  },
  info: { flex: 1, gap: 6 },
  name: { fontSize: 15, fontWeight: "700", color: colors.text.primary },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  price: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
  prep: { fontSize: 12, color: colors.text.muted },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#FEF6E0",
  },
  categoryTagText: { fontSize: 11, fontWeight: "600", color: "#B45309" },
  side: { alignItems: "flex-end", gap: 8 },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.subtle,
  },
  stock: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#86EFAC",
    backgroundColor: "#F0FDF4",
  },
  stockOut: { borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  stockText: { fontSize: 12, fontWeight: "700", color: "#15803D" },
  stockTextOut: { color: "#B91C1C" },
});
