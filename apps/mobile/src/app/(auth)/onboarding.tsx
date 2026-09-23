import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/constants/theme";
import { ONBOARDING_SLIDES } from "@/constants/onboarding-data";
import CustomButton from "@/components/CustomButton";

const ONBOARDING_STORAGE_KEY = "hasSeenOnboarding";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  const finishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch (err) {
      console.warn("Failed to persist onboarding state", err);
    } finally {
      router.replace("/(auth)/welcome");
    }
  }, []);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }
    swiperRef.current?.scrollBy(1);
  }, [isLastSlide, finishOnboarding]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.skipRow}>
        <Pressable onPress={finishOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination
        dot={<View style={styles.swiperDot} />}
        activeDot={<View style={styles.swiperActiveDot} />}
        onIndexChanged={setActiveIndex}
        paginationStyle={styles.pagination}
      >
        {ONBOARDING_SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Image
              source={slide.image}
              style={styles.slideImage}
              resizeMode="contain"
            />

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{slide.badge}</Text>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </Swiper>

      <View style={styles.ctaRow}>
        <CustomButton
          title={isLastSlide ? "Get Started" : "Next"}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  skipRow: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    marginTop: 20,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
  },
  slide: { flex: 1, alignItems: "center", paddingHorizontal: 24 },
  slideImage: { width: "100%", height: 400, marginBottom: 24 },
  badge: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    color: colors.primary.light,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  pagination: { bottom: 20 },
  swiperDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.light,
    marginHorizontal: 4,
  },
  swiperActiveDot: {
    width: 22,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.dark,
    marginHorizontal: 4,
  },
  ctaRow: { paddingHorizontal: 24, marginBottom: 16 },
});
