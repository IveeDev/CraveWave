import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

type ImagePickerVariant = "banner" | "square";

interface ImagePickerFieldProps {
  imageUrl: string | null;
  isUploading: boolean;
  onPress: () => void;
  variant?: ImagePickerVariant;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function ImagePickerField({
  imageUrl,
  isUploading,
  onPress,
  variant = "banner",
  placeholder = "Add photo",
  style,
}: ImagePickerFieldProps) {
  return (
    <Pressable
      style={[styles.base, styles[variant], style]}
      onPress={onPress}
      disabled={isUploading}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.preview} />
      ) : isUploading ? (
        <ActivityIndicator color={colors.text.muted} />
      ) : (
        <>
          <Ionicons name="camera-outline" size={20} color="#94A3B8" />
          <Text style={styles.text}>{placeholder}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
  },
  banner: {
    height: 90,
    width: "100%",
  },
  square: {
    height: 90,
    width: 90,
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
