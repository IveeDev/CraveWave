import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";
import React from "react";
import { colors, radius, spacing } from "@/constants/theme";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type CustomButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  color?: string; // overrides variant bg — for per-role/dynamic accents like role.accent
  textColor?: string;
  loading?: boolean;
  disabled?: boolean;
  IconLeft?: React.ComponentType<{ color: string; size: number }>;
  IconRight?: React.ComponentType<{ color: string; size: number }>;
};

const getVariantStyle = (variant: ButtonVariant, disabled?: boolean) => {
  if (disabled) {
    return { backgroundColor: colors.border.DEFAULT, borderWidth: 0 };
  }
  switch (variant) {
    case "secondary":
      return { backgroundColor: colors.text.muted, borderWidth: 0 };
    case "danger":
      return { backgroundColor: colors.semantic.danger, borderWidth: 0 };
    case "outline":
      return {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
      };
    default:
      return { backgroundColor: colors.primary.DEFAULT, borderWidth: 0 };
  }
};

const getTextColor = (variant: ButtonVariant, disabled?: boolean) => {
  if (disabled) return colors.text.muted;
  if (variant === "outline") return colors.text.primary;
  return colors.white;
};

const CustomButton = ({
  title,
  variant = "primary",
  color,
  textColor,
  loading = false,
  disabled = false,
  IconLeft,
  IconRight,
  style,
  ...props
}: CustomButtonProps) => {
  const variantStyle = getVariantStyle(variant, disabled);
  const resolvedBg =
    color && !disabled
      ? { backgroundColor: color, borderWidth: 0 }
      : variantStyle;
  const resolvedTextColor = textColor ?? getTextColor(variant, disabled);

  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        resolvedBg,
        typeof style === "function" ? style(state) : style,
        state.pressed && !disabled && styles.pressed,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={resolvedTextColor} />
      ) : (
        <>
          {IconLeft && <IconLeft color={resolvedTextColor} size={20} />}
          <Text style={[styles.text, { color: resolvedTextColor }]}>
            {title}
          </Text>
          {IconRight && <IconRight color={resolvedTextColor} size={20} />}
        </>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = {
  base: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
};
