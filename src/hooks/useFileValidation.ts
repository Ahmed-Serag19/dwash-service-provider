import { useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FileValidationConfig } from "@/interface/interfaces";
import {
  createFileValidator,
} from "@/utils/file-validation.utils";

export const useFileValidation = () => {
  const { t } = useTranslation();

  const imageValidationConfig: FileValidationConfig = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    errorMessages: {
      size: t("fileSizeError") || "File size must be less than 5MB",
      type: t("fileTypeError") || "Only JPEG, PNG, and WebP files are allowed",
    },
  };

  const documentValidationConfig: FileValidationConfig = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ],
    errorMessages: {
      size: t("fileSizeError") || "File size must be less than 5MB",
      type:
        t("fileTypeError") || "Only JPEG, PNG, WebP, and PDF files are allowed",
    },
  };

  const validateImageFile = useCallback(
    createFileValidator(imageValidationConfig),
    [t]
  );
  const validateDocumentFile = useCallback(
    createFileValidator(documentValidationConfig),
    [t]
  );

  const validateFile = useCallback(
    (file: File, type: "image" | "document" = "image"): boolean => {
      const validator =
        type === "image" ? validateImageFile : validateDocumentFile;
      const result = validator(file);

      if (!result.isValid && result.error) {
        toast.error(result.error);
        return false;
      }

      return true;
    },
    [validateImageFile, validateDocumentFile]
  );

  return { validateFile };
};
