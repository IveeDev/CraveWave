import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RestaurantImagePickerProps {
  imageUrl: string | null;
  isUploading: boolean;
  onPress: () => void;
}

export function RestaurantImagePicker({
  imageUrl,
  isUploading,
  onPress,
}: RestaurantImagePickerProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      disabled={isUploading}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.preview} />
      ) : isUploading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Ionicons name="camera-outline" size={20} color="#94A3B8" />

          <Text style={styles.text}>Add cover photo</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
  },

  text: {
    fontSize: 12,
    color: "#94A3B8",
  },

  preview: {
    width: "100%",
    height: "100%",
  },
});
