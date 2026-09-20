import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CreateRestaurantButtonProps {
  isCreating: boolean;
  isUploading: boolean;
  onPress: () => void;
}

const CreateRestaurantButton = ({
  isCreating,
  isUploading,
  onPress,
}: CreateRestaurantButtonProps) => {
  const isDisabled = isCreating || isUploading;

  return (
    <Pressable
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isCreating ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <>
          <Ionicons name="storefront" size={18} color="#FFF" />

          <Text style={styles.text}>Open Kitchen & Start Receiving Orders</Text>

          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </>
      )}
    </Pressable>
  );
};
export default CreateRestaurantButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#FF5A36",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  text: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
