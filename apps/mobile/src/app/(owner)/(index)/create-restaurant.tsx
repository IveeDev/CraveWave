import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCuisines } from "@/hooks/useCuisines";
import { useCreateRestaurant } from "@/hooks/useCreateRestaurant";
import { useUploadRestaurantImage } from "@/hooks/useUploadRestaurantImage";

import {
  QUICK_FILL_TEMPLATES,
  PREP_TIME_OPTIONS,
} from "@/constants/restaurant";

import { RestaurantHeader } from "@/components/restaurant/RestaurantHeader";
import QuickFillTemplates from "@/components/restaurant/QuickFillTemplate";
import CuisineSelector from "@/components/restaurant/CuisineSelector";
import { RestaurantImagePicker } from "@/components/restaurant/RestaurantImagePicker";
import { PrepTimeSelector } from "@/components/restaurant/PrepTimeSelector";
import { PayoutBanner } from "@/components/restaurant/PayoutBanner";
import CreateRestaurantButton from "@/components/restaurant/CreateRestaurantButton";

const CreateRestaurantScreen = () => {
  // ---------------------------------------------------------------------------
  // Form state
  // ---------------------------------------------------------------------------

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [selectedCuisineIds, setSelectedCuisineIds] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [prepTime, setPrepTime] = useState(20);

  // ---------------------------------------------------------------------------
  // Queries / mutations
  // ---------------------------------------------------------------------------

  const { data: cuisines = [], isLoading: isLoadingCuisines } = useCuisines();

  const { uploadImage, isUploading } = useUploadRestaurantImage();

  const { mutate: createRestaurant, isPending: isCreating } =
    useCreateRestaurant();

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  async function handlePickImage() {
    try {
      const url = await uploadImage();

      if (!url) {
        return;
      }

      setImageUrl(url);

      Alert.alert("Success", "Image uploaded successfully.");
    } catch (error) {
      console.error("Image upload error:", error);

      Alert.alert(
        "Upload failed",
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    }
  }

  function applyTemplate(template: (typeof QUICK_FILL_TEMPLATES)[number]) {
    setName(template.label);

    const matchingCuisine = cuisines.find(
      (cuisine) => cuisine.name.toLowerCase() === template.tag.toLowerCase(),
    );

    setSelectedCuisineIds(matchingCuisine ? [matchingCuisine.id] : []);
  }

  function handleSubmit() {
    // Basic validation
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

    // Create REstaurant
    createRestaurant(
      {
        name: name.trim(),
        description: tagline.trim() || undefined,
        address: address.trim(),
        kitchenPhone: phone.trim() || undefined,
        prepTimeMinutes: prepTime,
        imageUrl: imageUrl ?? undefined,
        cuisineIds: selectedCuisineIds,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Restaurant created successfully.");

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
      },
    );
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <RestaurantHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Fill Templates */}

        <QuickFillTemplates
          templates={QUICK_FILL_TEMPLATES}
          onSelect={applyTemplate}
        />

        {/* Restaurant Identity */}

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="storefront" size={18} color="#FF5A36" />

            <Text style={styles.cardHeader}>Restaurant Identity</Text>
          </View>

          {/* Restaurant name */}

          <Text style={styles.label}>Restaurant or kitchen name *</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Ember & Oak Bistro"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />

          {/* Tagline */}

          <Text style={styles.label}>Concept & tagline</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Artisanal wood-fired smash burgers, truffle fries"
            placeholderTextColor="#94A3B8"
            value={tagline}
            onChangeText={setTagline}
          />

          {/* Cuisines */}

          <View style={styles.cuisineLabelRow}>
            <Text style={styles.label}>Cuisine categories *</Text>

            <Text style={styles.labelHint}>Select one or more</Text>
          </View>

          <CuisineSelector
            cuisines={cuisines}
            selectedIds={selectedCuisineIds}
            onChange={setSelectedCuisineIds}
            isLoading={isLoadingCuisines}
          />

          {/* Restaurant image */}

          <Text style={[styles.label, styles.imageLabel]}>
            Storefront cover photo
          </Text>

          <RestaurantImagePicker
            imageUrl={imageUrl}
            isUploading={isUploading}
            onPress={handlePickImage}
          />
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Pickup Location & Hours */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location" size={18} color="#FF5A36" />

            <Text style={styles.cardHeader}>Pickup Location & Hours</Text>
          </View>

          {/* Address */}

          <Text style={styles.label}>Store pickup street address *</Text>

          <TextInput
            style={styles.input}
            placeholder="742 Evergreen Terrace, San Francisco, CA"
            placeholderTextColor="#94A3B8"
            value={address}
            onChangeText={setAddress}
          />

          {/* Phone + Hours */}

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

              <Pressable style={styles.input}>
                <Text style={styles.hoursText}>10:30 AM – 10:30 PM</Text>
              </Pressable>
            </View>
          </View>

          {/* Prep time */}

          <Text style={styles.label}>Target kitchen prep time</Text>

          <PrepTimeSelector
            value={prepTime}
            options={PREP_TIME_OPTIONS}
            onChange={setPrepTime}
          />
        </View>

        {/* Payout */}

        <PayoutBanner />

        {/* Submit */}
        <CreateRestaurantButton
          isCreating={isCreating}
          isUploading={isUploading}
          onPress={handleSubmit}
        />

        <Text style={styles.submitCaption}>
          Instant activation: your restaurant and starter menu will immediately
          publish to CraveWave.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRestaurantScreen;

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

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

  cardHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },

  labelHint: {
    fontSize: 12,
    color: "#94A3B8",
  },

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

  imageLabel: {
    marginTop: 16,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  halfField: {
    flex: 1,
  },

  hoursText: {
    color: "#94A3B8",
  },

  submitCaption: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 10,
  },
});
