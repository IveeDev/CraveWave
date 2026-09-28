import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

type FormInputProps = TextInputProps & {
  label: string;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  labelRight?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

const FormInput = ({
  label,
  required = false,
  icon,
  labelRight,
  containerStyle,
  style,
  secureTextEntry,
  ...props
}: FormInputProps) => {
  const isPasswordField = secureTextEntry !== undefined;
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && " *"}
        </Text>
        {labelRight}
      </View>

      <View style={styles.inputWrapper}>
        {icon && <Ionicons name={icon} size={20} color={colors.text.muted} />}

        <TextInput
          placeholderTextColor={colors.text.muted}
          style={[styles.input, style]}
          secureTextEntry={isPasswordField ? isSecure : undefined}
          {...props}
        />

        {isPasswordField && (
          <Pressable hitSlop={8} onPress={() => setIsSecure((prev) => !prev)}>
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.text.muted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: colors.background.subtle,
  },
  input: {
    flex: 1,
    height: "100%",
    padding: 0,
    fontSize: 14,
    color: colors.text.primary,
  },
});
