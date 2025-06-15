"use client";

import { useCallback } from "react";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";

export const useFileUploadDebug = () => {
  // Test 1: Try with extremely small image
  const testWithTinyImage = useCallback(async () => {
    try {
      // Create a tiny 1x1 pixel image
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      ctx!.fillStyle = "red";
      ctx!.fillRect(0, 0, 1, 1);

      return new Promise<File>((resolve) => {
        canvas.toBlob((blob) => {
          const file = new File([blob!], "tiny-test.png", {
            type: "image/png",
          });
          resolve(file);
        }, "image/png");
      });
    } catch (error) {
      console.error("Error creating tiny image:", error);
      throw error;
    }
  }, []);

  // Test 2: Try different file formats
  const testDifferentFormats = useCallback(async (originalFile: File) => {
    const formats = ["image/jpeg", "image/png", "image/webp"];
    const results = [];

    for (const format of formats) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(originalFile);
        });

        canvas.width = Math.min(img.width, 100); // Resize to max 100px
        canvas.height = Math.min(img.height, 100);
        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

        const convertedFile = await new Promise<File>((resolve) => {
          canvas.toBlob(
            (blob) => {
              const file = new File([blob!], `test.${format.split("/")[1]}`, {
                type: format,
              });
              resolve(file);
            },
            format,
            0.8
          );
        });

        results.push({ format, file: convertedFile, size: convertedFile.size });
      } catch (error) {
        results.push({
          format,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }, []);

  // Test 3: Progressive file size testing
  const testFileSizes = useCallback(async (originalFile: File) => {
    const sizes = [10, 50, 100, 500, 1000, 2000]; // KB
    const results = [];

    for (const maxSizeKB of sizes) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(originalFile);
        });

        // Calculate dimensions to achieve target file size
        let quality = 0.9;
        let testFile: File;

        do {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx!.drawImage(img, 0, 0);

          testFile = await new Promise<File>((resolve) => {
            canvas.toBlob(
              (blob) => {
                const file = new File([blob!], `test-${maxSizeKB}kb.jpg`, {
                  type: "image/jpeg",
                });
                resolve(file);
              },
              "image/jpeg",
              quality
            );
          });

          quality -= 0.1;
        } while (testFile.size > maxSizeKB * 1024 && quality > 0.1);

        results.push({
          targetSize: maxSizeKB,
          actualSize: Math.round(testFile.size / 1024),
          file: testFile,
          quality,
        });
      } catch (error) {
        results.push({
          targetSize: maxSizeKB,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }, []);

  // Test 4: Send files one by one
  const testIndividualFiles = useCallback(
    async (files: { [key: string]: File }) => {
      const results = [];

      for (const [fieldName, file] of Object.entries(files)) {
        try {
          const formData = new FormData();
          formData.append("brandNameAr", "Test");
          formData.append("brandNameEn", "Test");
          formData.append(fieldName, file);

          const token = sessionStorage.getItem("accessToken");

          const response = await axios.put(endpoints.editUser, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 30000,
          });

          results.push({ fieldName, status: "success", size: file.size });
        } catch (error: any) {
          results.push({
            fieldName,
            status: "error",
            size: file.size,
            error: error.response?.status,
            message: error.response?.data,
          });
        }
      }

      return results;
    },
    []
  );

  return {
    testWithTinyImage,
    testDifferentFormats,
    testFileSizes,
    testIndividualFiles,
  };
};
