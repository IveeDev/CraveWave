import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "@/constants/theme";
import { RoleConfig } from "../../constants/roles";
import CustomButton from "@/components/CustomButton";
import FormInput from "@/components/FormInput";

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
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
};

export const DetailsStep = ({
  role,
  form,
  onChange,
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
        <FormInput
          label="First Name"
          placeholder="Alex"
          value={form.firstName}
          onChangeText={(value) => onChange("firstName", value)}
          style={{ flex: 1 }}
          containerStyle={styles.halfField}
        />

        <FormInput
          label="Last Name"
          placeholder="Morgan"
          value={form.lastName}
          onChangeText={(value) => onChange("lastName", value)}
          style={{ flex: 1 }}
          containerStyle={styles.halfField}
        />
      </View>

      <FormInput
        label="Email Address"
        icon="mail-outline"
        placeholder="alex@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={form.email}
        onChangeText={(value) => onChange("email", value)}
        containerStyle={styles.fieldContainer}
      />

      <FormInput
        label="Phone Number"
        icon="call-outline"
        placeholder="+1 (415) 555-0182"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(value) => onChange("phone", value)}
        containerStyle={styles.fieldContainer}
      />

      <FormInput
        label="Password"
        icon="lock-closed-outline"
        placeholder="Create password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={form.password}
        onChangeText={(value) => onChange("password", value)}
        containerStyle={styles.fieldContainer}
      />

      <View style={styles.hintRow}>
        <Text style={styles.hintText}>8+ characters</Text>
        <Text style={styles.hintText}>1+ number</Text>
      </View>

      <FormInput
        label="Confirm Password"
        icon="lock-closed-outline"
        placeholder="Re-enter password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={form.confirmPassword}
        onChangeText={(value) => onChange("confirmPassword", value)}
        containerStyle={styles.fieldContainer}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <CustomButton
        title={`Create ${role.label} Account`}
        color={role.accent}
        loading={loading}
        onPress={onSubmit}
        IconRight={(iconProps) => (
          <Ionicons name="arrow-forward" {...iconProps} />
        )}
        style={{ marginTop: spacing.sm }}
      />
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
    marginBottom: spacing.lg,
  },
  halfField: {
    flex: 1,
    marginBottom: 0,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  hintRow: {
    flexDirection: "row" as const,
    gap: spacing.md,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
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
};
