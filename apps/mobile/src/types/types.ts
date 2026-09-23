import { TouchableOpacityProps } from "react-native";

export type ButtonBgVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "outline"
  | "text";

export type ButtonTextVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "default";

export type ButtonProps = TouchableOpacityProps & {
  onPress?: () => void;
  title: string;
  bgVariant?: ButtonBgVariant;
  textVariant?: ButtonTextVariant;
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
};
