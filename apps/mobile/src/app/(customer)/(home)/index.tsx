import { ScrollView, StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from "@/components/FormInput";
import HomeHeader from "@/components/HomeHeader";
import { useAuthStore } from "@/store/auth-store";
import CuisineChips, { ALL_CUISINES } from "@/components/CuisineChips";
import { useCuisines } from "@/hooks/use-cuisines";

const CustomerHomeScreen = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [activeCuisineId, setActiveCuisineId] = useState<string>(ALL_CUISINES);

  const { data: cuisines = [], isPending: isCuisinesPending } = useCuisines();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          locationLabel="Home"
          address={`${user?.firstName} ${user?.lastName}`}
          notificationCount={1}
          onLocationPress={() => {}}
          onNotificationsPress={() => {}}
        />

        <FormInput
          icon="search-outline"
          placeholder="Search burgers, ramen, sushi, vegan..."
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCorrect={false}
          containerStyle={styles.search}
        />

        {/* Active order, categories, promo banner, recommended... come next */}

        <View style={styles.section}>
          <CuisineChips
            cuisines={cuisines}
            activeId={activeCuisineId}
            onSelect={setActiveCuisineId}
            isLoading={isCuisinesPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerHomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 },
  search: { marginTop: 16 },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 24,
  },
  section: { marginTop: 24 },
});
