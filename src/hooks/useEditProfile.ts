import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import { buildFormData } from "@/utils/form-data-utils";
import { logFormDataContents } from "@/utils/file-validation.utils";
import { useFileValidation } from "./useFileValidation";
import type { EditProfileFormData } from "@/interface/interfaces";

export const useEditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { validateFile } = useFileValidation();

  const handleError = useCallback(
    (error: any) => {
      console.error("Upload error:", error);

      if (error.response) {
        console.error(
          "Error response:",
          error.response.status,
          error.response.data
        );

        const errorMessages = {
          403:
            t("accessDeniedError") ||
            "Access denied. Please check your permissions.",
          413:
            t("fileTooLargeError") ||
            "File too large. Please reduce file size.",
          401: t("authError") || "Authentication failed. Please login again.",
          default:
            t("profileUpdateError") ||
            "Profile update failed. Please try again.",
        };

        const message =
          errorMessages[error.response.status as keyof typeof errorMessages] ||
          errorMessages.default;
        toast.error(message);
      } else if (error.request) {
        toast.error(
          t("networkError") || "Network error. Please check your connection."
        );
      } else {
        toast.error(
          t("profileUpdateError") || "Profile update failed. Please try again."
        );
      }
    },
    [t]
  );

  const validateFiles = useCallback(
    (data: EditProfileFormData): boolean => {
      const filesToValidate = [
        { file: data.brandLogo?.[0], type: "image" as const },
        { file: data.brandBackgroundImage?.[0], type: "image" as const },
        { file: data.bankCertificate?.[0], type: "document" as const },
      ];

      return filesToValidate.every(({ file, type }) => {
        if (!file) return true;
        return validateFile(file, type);
      });
    },
    [validateFile]
  );

  const submitProfile = useCallback(
    async (data: EditProfileFormData) => {
      try {
        // Validate files first
        if (!validateFiles(data)) return;

        // Build form data
        const formData = buildFormData(data);
        logFormDataContents(formData);

        // Check authentication
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          toast.error(t("authError") || "Authentication token not found");
          return;
        }

        // Submit request
        const response = await axios.put(endpoints.editUser, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        });

        console.log("Success response:", response.data);
        toast.success(t("profileUpdateSuccess"));
        navigate("/profile");
      } catch (error) {
        handleError(error);
      }
    },
    [validateFiles, handleError, navigate, t]
  );

  return { submitProfile };
};
