import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";

const LoginScreen = () => {
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return Alert.alert("Please fill in all fields");
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch {
      Alert.alert("Login failed", "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }
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
          {/* Back Button */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>

          {/* Heading */}
          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Log in to continue your food delivery experience.
          </Text>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email address</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.text.muted}
              />

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor={colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>

              <Pressable hitSlop={8}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </Pressable>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.text.muted}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={colors.text.muted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                hitSlop={8}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.text.muted}
                />
              </Pressable>
            </View>
          </View>

          {/* Login Button */}
          <Pressable
            style={styles.loginButton}
            onPress={() => void handleLogin()}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>Log In</Text>

            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>

            <View style={styles.divider} />
          </View>

          {/* Google Button */}
          <Pressable style={styles.googleButton}>
            <Text style={styles.googleIcon}>G</Text>

            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>

            <Pressable
              hitSlop={8}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.signupLink}> Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    padding: spacing["2xl"],
    paddingBottom: spacing["4xl"],
  },

  /* Back Button */
  backButton: {
    marginTop: spacing["2xl"],
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary.light,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Heading */
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: colors.text.primary,
    marginTop: 80,
  },

  subtitle: {
    fontSize: 16,
    marginTop: spacing.sm,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing["3xl"],
  },

  /* Fields */
  fieldContainer: {
    marginBottom: spacing.lg,
  },

  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    height: "100%",
  },

  /* Password */
  passwordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  forgotPassword: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary.DEFAULT,
    marginBottom: spacing.sm,
  },

  /* Login Button */
  loginButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary.DEFAULT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  loginButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },

  /* Divider */
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginVertical: spacing["2xl"],
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.DEFAULT,
  },

  dividerText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.muted,
  },

  /* Google */
  googleButton: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  googleIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4285F4",
  },

  googleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },

  /* Sign Up */
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing["3xl"],
  },

  signupText: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  signupLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary.DEFAULT,
  },
});
