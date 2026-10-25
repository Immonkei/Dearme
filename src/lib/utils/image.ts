/**
 * Image processing utilities for Dear Me:
 * Strips GPS and EXIF metadata by re-encoding through HTML5 canvas,
 * validates file types and dimensions.
 */

export interface ProcessedImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

export async function processAndStripExif(
  file: File,
  maxDimension: number = 2400,
  quality: number = 0.9
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    // Check supported types
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Unsupported image format. Dear Me supports JPEG, PNG, and WebP."));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down if exceeding maximum dimension while preserving aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Unable to create canvas context for image processing."));
        return;
      }

      // Draw onto canvas - this completely strips all EXIF/GPS metadata
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output mime type
      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed."));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              blob,
              dataUrl: reader.result as string,
              width,
              height,
            });
          };
          reader.onerror = () => reject(new Error("Failed to read processed image data."));
          reader.readAsDataURL(blob);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image file. File may be corrupted."));
    };

    img.src = objectUrl;
  });
}
