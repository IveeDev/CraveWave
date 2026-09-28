import { useState } from "react";
import { pickAndUploadImage, UploadType } from "@/lib/cloudinary";

export function useImageUpload(type: UploadType) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async () => {
    try {
      setIsUploading(true);
      return await pickAndUploadImage(type);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
}
