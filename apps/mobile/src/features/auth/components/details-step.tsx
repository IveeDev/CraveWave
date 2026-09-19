import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "@/constants/theme";
import { RoleConfig } from "../roles";

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type DetailsStepProps = {
  role: RoleConfig;
  form: FormState;
  onChange: (key: keyof FormState, value: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
};

export const DetailsStep = ({
  role,
  form,
  onChange,
  showPassword,
  onToggleShowPassword,
  error,
  loading,
  onSubmit,
}: DetailsStepProps) => {
  return (
    <View>
      <View style={[styles.roleTag, { backgroundColor: role.accentLight }]}>
        <Text style={[styles.roleTagText, { color: role.accent }]}>
          {role.label} Account
        </Text>
      </View>

      <Text style={styles.title}>Sign up as {role.label}</Text>

      <Text style={styles.subtitle}>
        Create an account to get started as a {role.label.toLowerCase()}.
      </Text>

      {/* First + Last name */}
      <View style={styles.rowFields}>
        <View style={[styles.fieldContainer, styles.halfField]}>
          <Text style={styles.label}>First Name</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Alex"
              placeholderTextColor={colors.text.muted}
              value={form.firstName}
              onChangeText={(value) => onChange("firstName", value)}
            />
          </View>
        </View>

        <View style={[styles.fieldContainer, styles.halfField]}>
          <Text style={styles.label}>Last Name</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Morgan"
              placeholderTextColor={colors.text.muted}
              value={form.lastName}
              onChangeText={(value) => onChange("lastName", value)}
            />
          </View>
        </View>
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email Address</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color={colors.text.muted} />

          <TextInput
            style={styles.input}
            placeholder="alex@example.com"
            placeholderTextColor={colors.text.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={form.email}
            onChangeText={(value) => onChange("email", value)}
          />
        </View>
      </View>

      {/* Phone */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Phone Number</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={20} color={colors.text.muted} />

          <TextInput
            style={styles.input}
            placeholder="+1 (415) 555-0182"
            placeholderTextColor={colors.text.muted}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(value) => onChange("phone", value)}
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={colors.text.muted}
          />

          <TextInput
            style={styles.input}
            placeholder="Create password"
            placeholderTextColor={colors.text.muted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={form.password}
            onChangeText={(value) => onChange("password", value)}
          />

          <Pressable hitSlop={8} onPress={onToggleShowPassword}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.text.muted}
            />
          </Pressable>
        </View>

        <View style={styles.hintRow}>
          <Text style={styles.hintText}>8+ characters</Text>

          <Text style={styles.hintText}>1+ number</Text>
        </View>
      </View>

      {/* Confirm password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Confirm Password</Text>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={colors.text.muted}
          />

          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor={colors.text.muted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={form.confirmPassword}
            onChangeText={(value) => onChange("confirmPassword", value)}
          />
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        style={[styles.primaryButton, { backgroundColor: role.accent }]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>
              Create {role.label} Account
            </Text>

            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = {
  roleTag: {
    alignSelf: "flex-start" as const,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: spacing.lg,
  },

  roleTagText: {
    fontSize: 11,
    fontWeight: "700" as const,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800" as const,
    color: colors.text.primary,
    marginTop: spacing["2xl"],
  },

  subtitle: {
    fontSize: 15,
    marginTop: spacing.sm,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing["2xl"],
  },

  rowFields: {
    flexDirection: "row" as const,
    gap: spacing.md,
  },

  halfField: {
    flex: 1,
  },

  fieldContainer: {
    marginBottom: spacing.lg,
  },

  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  inputWrapper: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    backgroundColor: colors.white,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    height: "100%" as const,
  },

  hintRow: {
    flexDirection: "row" as const,
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  hintText: {
    fontSize: 12,
    color: colors.text.muted,
  },

  errorText: {
    fontSize: 13,
    color: "#DC2626",
    marginBottom: spacing.md,
  },

  primaryButton: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700" as const,
  },
};
