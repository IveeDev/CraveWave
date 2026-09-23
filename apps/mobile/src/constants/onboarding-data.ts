import { ImageSourcePropType } from "react-native";
import discover from "@/assets/images/discover.png";
import tracker from "@/assets/images/tracker.png";
import checkout from "@/assets/images/checkout.png";

export const images = {
  discover,
  checkout,
  tracker,
};

export type OnboardingSlide = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "discover",
    badge: "CURATED KITCHENS & MENUS",
    title: "Discover great food around you",
    subtitle:
      "Explore restaurants, discover your favorite meals, and find something delicious wherever you are.",
    image: images.discover,
  },
  {
    id: "checkout",
    badge: "SEAMLESS CHECKOUT",
    title: "Order with ease",
    subtitle:
      "Choose your favorite meals, customize your order, and pay securely in just a few steps.",
    image: images.checkout,
  },
  {
    id: "tracker",
    badge: "LIVE GPS COURIER TRACKER",
    title: "Know where your food is",
    subtitle:
      "Track your order from the restaurant to your doorstep and get notified every step of the way.",
    image: images.tracker,
  },
];
