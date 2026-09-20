import { useState } from "react";
import { pickAndUploadImage } from "@/lib/cloudinary";

export function useUploadRestaurantImage() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async () => {
    try {
      setIsUploading(true);

      return await pickAndUploadImage("restaurant");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
  };
}
