"use client";

import { useCallback } from "react";

export const useOptimizedFileUpload = () => {
  const compressImage = useCallback(
    async (file: File, maxSizeKB = 500): Promise<File> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions (max 1024px)
          const maxDimension = 1024;
          let { width, height } = img;

          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Try different quality levels to achieve target size
          let quality = 0.9;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                const compressedFile = new File([blob!], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                if (compressedFile.size <= maxSizeKB * 1024 || quality <= 0.1) {
                  resolve(compressedFile);
                } else {
                  quality -= 0.1;
                  tryCompress();
                }
              },
              "image/jpeg",
              quality
            );
          };

          tryCompress();
        };

        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const validateAndCompress = useCallback(
    async (file: File): Promise<File> => {
      // Always compress to ensure compatibility
      const compressed = await compressImage(file, 500); // 500KB max
      console.log(
        `Compressed ${file.name}: ${file.size} -> ${compressed.size} bytes`
      );
      return compressed;
    },
    [compressImage]
  );

  return { validateAndCompress };
};
