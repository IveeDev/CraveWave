// lib/cloudinary.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { api } from "@/lib/axios";

type UploadType = "restaurant" | "menuItem" | "profile";

export async function pickAndUploadImage(
  type: UploadType,
): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      "Permission required",
      "Please allow access to your photo library.",
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];

  const { data: sig } = await api.post("/uploads/signature", { type });

  return uploadToCloudinary(asset, sig);
}

function uploadToCloudinary(
  asset: ImagePicker.ImagePickerAsset,
  sig: {
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
    cloudName: string;
  },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      true,
    );
    xhr.responseType = "json";

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response.secure_url);
      } else {
        console.error("Cloudinary upload failed:", {
          status: xhr.status,
          response: xhr.response,
        });
        reject(new Error("Failed to upload image"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Failed to upload image: network error"));
    });

    const formData = new FormData();
    formData.append("file", {
      uri: asset.uri,
      type: asset.mimeType ?? "image/jpeg",
      name: asset.fileName ?? "upload.jpg",
    } as any);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    xhr.send(formData as any);
  });
}
