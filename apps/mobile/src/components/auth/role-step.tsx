import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserRole } from "@food-delivery/types";

import { colors, radius, spacing } from "@/constants/theme";
import { ROLES } from "../../constants/roles";
import CustomButton from "@/components/CustomButton";

type RoleStepProps = {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
  onContinue: () => void;
};

export const RoleStep = ({
  selectedRole,
  onSelect,
  onContinue,
}: RoleStepProps) => {
  const activeRole = ROLES.find((role) => role.value === selectedRole);

  return (
    <View>
      <Text style={styles.title}>Create your account</Text>

      <Text style={styles.subtitle}>
        How would you like to use the platform?
      </Text>

      <View style={styles.roleList}>
        {ROLES.map((role) => {
          const isSelected = role.value === selectedRole;

          return (
            <Pressable
              key={role.value}
              onPress={() => onSelect(role.value)}
              style={[
                styles.roleCard,
                isSelected && {
                  borderColor: role.accent,
                  backgroundColor: role.cardBg,
                },
              ]}
            >
              <View
                style={[
                  styles.roleIconBubble,
                  {
                    backgroundColor: isSelected
                      ? role.accent
                      : colors.background.DEFAULT,
                  },
                ]}
              >
                <Ionicons
                  name={role.icon}
                  size={22}
                  color={isSelected ? colors.white : colors.text.muted}
                />
              </View>

              <View style={styles.roleTextGroup}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleLabel}>{role.label}</Text>

                  <View
                    style={[
                      styles.roleBadge,
                      {
                        backgroundColor: role.accentLight,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.roleBadgeText, { color: role.accent }]}
                    >
                      {role.badge}
                    </Text>
                  </View>
                </View>

                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  isSelected && {
                    borderColor: role.accent,
                  },
                ]}
              >
                {isSelected && (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: role.accent },
                    ]}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
      <CustomButton
        title="Continue"
        color={activeRole?.accent}
        disabled={!activeRole}
        onPress={onContinue}
        IconRight={(iconProps) => (
          <Ionicons name="arrow-forward" {...iconProps} />
        )}
      />
    </View>
  );
};

const styles = {
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

  roleList: {
    gap: spacing.md,
    marginBottom: spacing["2xl"],
  },

  roleCard: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border.DEFAULT,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },

  roleIconBubble: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  roleTextGroup: {
    flex: 1,
  },

  roleTitleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    marginBottom: 4,
  },

  roleLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text.primary,
  },

  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },

  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },

  roleDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border.DEFAULT,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 2,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
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
