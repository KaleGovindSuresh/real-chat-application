// src/services/cloudinaryService.ts
// Uploads via server /api/upload endpoint (server handles Cloudinary credentials).
// Falls back to direct Cloudinary upload if VITE_CLOUDINARY_CLOUD_NAME is set.

import type { CloudinaryResponse } from "../types";
import apiClient from "./apiClient";

export function getMediaType(file: File): "image" | "video" {
  if (file.type.startsWith("video/")) return "video";
  return "image";
}

function hasValidDirectCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) return false;
  if (
    cloudName === "your_cloud_name" ||
    uploadPreset === "your_unsigned_preset"
  ) {
    return false;
  }

  return true;
}

// ─── Server-proxied upload (default, recommended) ─────────────────────────────

export async function uploadViaServer(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<CloudinaryResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<CloudinaryResponse>(
    "/api/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress(event) {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );

  // Normalise: server returns { url, publicId, resourceType, ... }
  // but we expose the Cloudinary-shaped object downstream
  const raw = response.data as unknown as {
    url: string;
    publicId: string;
    resourceType: string;
    format: string;
    bytes: number;
  };

  return {
    secure_url: raw.url ?? (response.data as CloudinaryResponse).secure_url,
    public_id: raw.publicId ?? (response.data as CloudinaryResponse).public_id,
    resource_type: (raw.resourceType ?? "image") as "image" | "video" | "raw",
    format: raw.format,
    bytes: raw.bytes,
    original_filename: file.name,
  };
}

// ─── Direct Cloudinary upload (opt-in via env vars) ───────────────────────────

export async function uploadDirectToCloudinary(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<CloudinaryResponse> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!hasValidDirectCloudinaryConfig() || !cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars not set; use uploadViaServer instead");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "realchat");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as CloudinaryResponse);
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

// ─── Unified upload (picks the right strategy automatically) ─────────────────

export async function uploadMedia(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<CloudinaryResponse> {
  try {
    return await uploadViaServer(file, onProgress);
  } catch (serverError) {
    if (!hasValidDirectCloudinaryConfig()) {
      throw serverError;
    }
    return uploadDirectToCloudinary(file, onProgress);
  }
}
