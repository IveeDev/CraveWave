import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { colors } from "@/constants/theme";

type EmptyMenuStateProps = {
  categoryName?: string; // undefined = "All" tab
  onAddDish: () => void;
};

const EmptyMenuState = ({ categoryName, onAddDish }: EmptyMenuStateProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="restaurant-outline" size={28} color="#E17117" />
      </View>

      <Text style={styles.title}>
        {categoryName ? `No dishes in "${categoryName}" yet` : "No dishes yet"}
      </Text>

      <Text style={styles.subtitle}>
        {categoryName
          ? "Add your first delicious menu item to this category to start taking orders."
          : "Add your first menu item to start taking orders."}
      </Text>

      <CustomButton
        title={
          categoryName ? `Add Dish to ${categoryName}` : "Add Your First Dish"
        }
        variant="primary"
        onPress={onAddDish}
        IconLeft={({ color, size }) => (
          <Ionicons name="add" size={size} color={color} />
        )}
        style={styles.button}
      />
    </View>
  );
};

export default EmptyMenuState;

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: 24,
    gap: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: "#FFF",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF6E0",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.muted,
    textAlign: "center",
  },
  button: { marginTop: 12, paddingHorizontal: 20 },
});
