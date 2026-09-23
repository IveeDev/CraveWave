import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing } from "@/constants/theme";
import { UserRole } from "@food-delivery/types";
import { useAuthStore } from "@/store/auth-store";

import { ROLES } from "@/constants/roles";
import { DetailsStep, FormState } from "@/components/auth/details-step";
import { RoleStep } from "@/components/auth/role-step";

export default function RegisterScreen() {
  /*
   * ----------------------------------------
   * Auth
   * ----------------------------------------
   */

  const { register } = useAuthStore();

  /*
   * ----------------------------------------
   * Screen state
   * ----------------------------------------
   */

  const [step, setStep] = useState<1 | 2>(1);

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * ----------------------------------------
   * Derived data
   * ----------------------------------------
   */

  const activeRole =
    ROLES.find((role) => role.value === selectedRole) ?? ROLES[0];

  /*
   * ----------------------------------------
   * Form helpers
   * ----------------------------------------
   */

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  /*
   * ----------------------------------------
   * Step navigation
   * ----------------------------------------
   */

  const goToStepTwo = () => {
    if (!selectedRole) {
      return;
    }

    setError(null);
    setStep(2);
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setError(null);
      return;
    }

    router.replace("/(auth)/onboarding");
  };

  /*
   * ----------------------------------------
   * Registration
   * ----------------------------------------
   */

  const handleSubmit = async () => {
    setError(null);

    /*
     * Client-side validation.
     *
     * The backend still performs
     * authoritative validation.
     */

    if (!selectedRole) {
      setError("Please select a role.");
      setStep(1);
      return;
    }

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: selectedRole,
      });

      /*
       * The register() method:
       *
       * 1. Calls POST /auth/register
       * 2. Saves the JWT token
       * 3. Stores the authenticated user
       *
       * Therefore the user is logged in
       * immediately after registration.
       */

      router.replace("/");
    } catch (err: any) {
      const message = err?.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message[0]);
      } else if (typeof message === "string") {
        setError(message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * ----------------------------------------
   * Render
   * ----------------------------------------
   */

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={goBack} hitSlop={10}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text.primary}
              />
            </Pressable>

            <Text style={styles.stepLabel}>Step {step} of 2</Text>

            {/* Keeps the step label centered */}
            <View style={styles.headerSpacer} />
          </View>

          {/* Progress bar */}

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: step === 1 ? "50%" : "100%",
                },
              ]}
            />
          </View>

          {/* Step content */}

          {step === 1 ? (
            <RoleStep
              selectedRole={selectedRole}
              onSelect={setSelectedRole}
              onContinue={goToStepTwo}
            />
          ) : (
            <DetailsStep
              role={activeRole}
              form={form}
              onChange={updateField}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((value) => !value)}
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
            />
          )}

          {/* Login link */}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>

            <Pressable onPress={() => router.push("/(auth)/login")} hitSlop={8}>
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/*
 * ----------------------------------------
 * Styles
 * ----------------------------------------
 *
 * These styles belong only to the
 * RegisterScreen itself.
 *
 * RoleStep owns role-card styles.
 * DetailsStep owns form/input styles.
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  stepLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  headerSpacer: {
    width: 44,
    height: 44,
  },

  progressTrack: {
    height: 4,
    width: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.border.DEFAULT,
    overflow: "hidden",
    marginBottom: spacing.xl,
  },

  progressFill: {
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primary.DEFAULT,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xl,
  },

  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary.DEFAULT,
  },
});
