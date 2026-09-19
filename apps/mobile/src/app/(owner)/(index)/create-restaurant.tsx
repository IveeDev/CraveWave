import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { openSettings } from "expo-linking";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { pickAndUploadImage } from "@/lib/cloudinary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { router } from "expo-router";

// Placeholder — will come from GET /cuisines once we wire functionality
const CUISINE_OPTIONS = [
  "Burgers",
  "American",
  "Pizza",
  "Italian",
  "Asian",
  "Japanese & Sushi",
  "Mexican & Tacos",
  "Healthy & Bowls",
  "BBQ & Smokehouse",
  "Desserts & Bakery",
  "Drinks & Cafe",
];

// Placeholder templates for the Quick-Fill feature
const QUICK_FILL_TEMPLATES = [
  { id: "burgers", label: "Craft Burgers", tag: "Burgers", emoji: "🍔" },
  { id: "pizza", label: "Wood-Fired Pizza", tag: "Pizza", emoji: "🍕" },
  { id: "poke", label: "Poke Bowls", tag: "Healthy", emoji: "🥗" },
];

const PREP_TIME_OPTIONS = [15, 20, 25, 30, 45];

interface Cuisine {
  id: string;
  name: string;
}

const CreateRestaurantScreen = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [selectedCuisineIds, setSelectedCuisineIds] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [prepTime, setPrepTime] = useState(20);

  // Real cuisine list, fetched from the backend
  const { data: cuisines = [], isLoading: isLoadingCuisines } = useQuery<
    Cuisine[]
  >({
    queryKey: ["cuisines"],
    queryFn: () => api.get<Cuisine[]>("/cuisines").then((res) => res.data),
  });

  const handlePickImage = async () => {
    try {
      setIsUploading(true);

      const url = await pickAndUploadImage("restaurant");

      if (url) {
        setImageUrl(url);
        Alert.alert("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Image upload error:", error);

      Alert.alert(
        "Upload failed",
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const { mutate: createRestaurant, isPending } = useMutation({
    mutationFn: () =>
      api.post("/restaurants", {
        name,
        description: tagline,
        address,
        kitchenPhone: phone,
        prepTimeMinutes: prepTime,
        imageUrl: imageUrl ?? undefined,
        cuisineIds: selectedCuisineIds,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      Alert.alert("Restaurant created successfully");
      router.replace("/(owner)/(index)");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      const friendlyMessage =
        status === 400 && message
          ? Array.isArray(message)
            ? message[0]
            : message
          : "Something went wrong. Please try again.";

      Alert.alert("Restaurant creation failed", friendlyMessage);
    },
  });

  function toggleCuisine(cuisineId: string) {
    setSelectedCuisineIds((prev) =>
      prev.includes(cuisineId)
        ? prev.filter((id) => id !== cuisineId)
        : [...prev, cuisineId],
    );
  }

  function applyTemplate(template: (typeof QUICK_FILL_TEMPLATES)[number]) {
    setName(template.label);

    const match = cuisines.find(
      (c) => c.name.toLowerCase() === template.tag.toLowerCase(),
    );
    setSelectedCuisineIds(match ? [match.id] : []);
  }

  function handleSubmit() {
    if (!name.trim() || !address.trim()) {
      Alert.alert(
        "Missing details",
        "Please enter a restaurant name and address.",
      );
      return;
    }

    if (selectedCuisineIds.length === 0) {
      Alert.alert(
        "Select a cuisine",
        "Please choose at least one cuisine category.",
      );
      return;
    }

    createRestaurant();
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color="#FFF" />
        <Text style={styles.headerText}>Kitchen Setup Portal</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Quick-Fill Template */}
        <View style={styles.templateCard}>
          <View style={styles.templateHeaderRow}>
            <View style={styles.templateHeaderLeft}>
              <Ionicons name="flash" size={18} color="#FF5A36" />
              <Text style={styles.templateTitle}>
                Quick-Fill Kitchen Template
              </Text>
            </View>
            <View style={styles.templateBadge}>
              <Text style={styles.templateBadgeText}>1-Tap Setup</Text>
            </View>
          </View>

          <Text style={styles.templateSubtitle}>
            Testing or presenting? Tap any template to auto-fill realistic
            restaurant details and open your kitchen immediately.
          </Text>

          <View style={styles.templateRow}>
            {QUICK_FILL_TEMPLATES.map((template) => (
              <Pressable
                key={template.id}
                style={styles.templateChip}
                onPress={() => applyTemplate(template)}
              >
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
                <Text style={styles.templateChipLabel} numberOfLines={1}>
                  {template.label}
                </Text>
                <Text style={styles.templateChipTag}>{template.tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Restaurant Identity */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="storefront" size={18} color="#FF5A36" />
            <Text style={styles.cardHeader}>Restaurant Identity</Text>
          </View>

          <Text style={styles.label}>Restaurant or kitchen name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Ember & Oak Bistro"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Concept & tagline</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Artisanal wood-fired smash burgers, truffle fries"
            placeholderTextColor="#94A3B8"
            value={tagline}
            onChangeText={setTagline}
          />

          <View style={styles.cuisineLabelRow}>
            <Text style={styles.label}>Cuisine categories *</Text>
            <Text style={styles.labelHint}>Select one or more</Text>
          </View>
          {isLoadingCuisines ? (
            <ActivityIndicator style={{ marginBottom: 16 }} />
          ) : (
            <View style={styles.chipWrap}>
              {cuisines.map((cuisine) => {
                const selected = selectedCuisineIds.includes(cuisine.id);
                return (
                  <Pressable
                    key={cuisine.id}
                    onPress={() => toggleCuisine(cuisine.id)}
                    style={[
                      styles.cuisineChip,
                      selected && styles.cuisineChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.cuisineChipText,
                        selected && styles.cuisineChipTextSelected,
                      ]}
                    >
                      {cuisine.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={[styles.label, { marginTop: 16 }]}>
            Storefront cover photo
          </Text>
          <Pressable
            style={styles.imagePicker}
            onPress={handlePickImage}
            disabled={isUploading}
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
            ) : isUploading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Ionicons name="camera-outline" size={20} color="#94A3B8" />
                <Text style={styles.imagePickerText}>Add cover photo</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Pickup Location & Hours */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location" size={18} color="#FF5A36" />
            <Text style={styles.cardHeader}>Pickup Location & Hours</Text>
          </View>

          <Text style={styles.label}>Store pickup street address *</Text>
          <TextInput
            style={styles.input}
            placeholder="742 Evergreen Terrace, San Francisco, CA"
            placeholderTextColor="#94A3B8"
            value={address}
            onChangeText={setAddress}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Kitchen phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (415) 555-0100"
                placeholderTextColor="#94A3B8"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Operating hours</Text>
              {/* Stub for now — real time-range picker comes in the
                  functionality pass, this needs its own component */}
              <Pressable style={styles.input}>
                <Text style={{ color: "#94A3B8" }}>10:30 AM – 10:30 PM</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.label}>Target kitchen prep time</Text>
          <View style={styles.chipRow}>
            {PREP_TIME_OPTIONS.map((minutes) => {
              const selected = prepTime === minutes;
              return (
                <Pressable
                  key={minutes}
                  onPress={() => setPrepTime(minutes)}
                  style={[styles.prepChip, selected && styles.prepChipSelected]}
                >
                  <Text
                    style={[
                      styles.prepChipText,
                      selected && styles.prepChipTextSelected,
                    ]}
                  >
                    {minutes}m
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Payouts info banner (static, no fields) */}
        <View style={styles.payoutBanner}>
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          <View style={styles.payoutTextBlock}>
            <Text style={styles.payoutTitle}>
              Direct Merchant Payouts Active
            </Text>
            <Text style={styles.payoutSubtitle}>
              Earnings are deposited daily. You can manage banking preferences
              anytime in Settings.
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.submitButton,
            (isPending || isUploading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isPending || isUploading}
        >
          {isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="storefront" size={18} color="#FFF" />
              <Text style={styles.submitButtonText}>
                Open Kitchen & Start Receiving Orders
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </>
          )}
        </Pressable>
        <Text style={styles.submitCaption}>
          Instant activation: your restaurant and starter menu will immediately
          publish to CraveWave.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRestaurantScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF5A36",
    paddingVertical: 14,
  },
  headerText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  content: { padding: 16, paddingBottom: 40 },

  templateCard: {
    backgroundColor: "#FFF8F6",
    borderWidth: 1,
    borderColor: "#FFD9CC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  templateHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  templateHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  templateTitle: { fontWeight: "700", fontSize: 14, color: "#0F172A" },
  templateBadge: {
    backgroundColor: "#FFF0ED",
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  templateBadgeText: { color: "#E04523", fontSize: 11, fontWeight: "700" },
  templateSubtitle: { fontSize: 12, color: "#64748B", marginBottom: 12 },
  templateRow: { flexDirection: "row", gap: 8 },
  templateChip: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    alignItems: "center",
  },
  templateEmoji: { fontSize: 22, marginBottom: 4 },
  templateChipLabel: { fontSize: 11, fontWeight: "600", color: "#0F172A" },
  templateChipTag: { fontSize: 10, color: "#94A3B8" },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardHeader: { fontSize: 16, fontWeight: "700", color: "#0F172A" },

  label: { fontSize: 13, fontWeight: "600", color: "#0F172A", marginBottom: 6 },
  labelHint: { fontSize: 12, color: "#94A3B8" },
  cuisineLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: "center",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },

  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cuisineChip: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cuisineChipSelected: { backgroundColor: "#FF5A36", borderColor: "#FF5A36" },
  cuisineChipText: { fontSize: 13, color: "#0F172A", fontWeight: "600" },
  cuisineChipTextSelected: { color: "#FFF" },

  chipRow: { flexDirection: "row", gap: 8 },
  prepChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9999,
    paddingVertical: 10,
    alignItems: "center",
  },
  prepChipSelected: { backgroundColor: "#FF5A36", borderColor: "#FF5A36" },
  prepChipText: { fontSize: 13, fontWeight: "600", color: "#0F172A" },
  prepChipTextSelected: { color: "#FFF" },

  payoutBanner: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  payoutTextBlock: { flex: 1 },
  payoutTitle: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  payoutSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },

  submitButton: {
    flexDirection: "row",
    backgroundColor: "#FF5A36",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  submitCaption: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 10,
  },

  imagePicker: {
    height: 90,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
  },
  imagePickerText: { fontSize: 12, color: "#94A3B8" },
  imagePreview: { width: "100%", height: "100%" },
  submitButtonDisabled: { opacity: 0.6 },
});
