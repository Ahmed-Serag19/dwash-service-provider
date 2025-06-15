import type { FileValidationConfig } from "@/interface/interfaces";

export const createFileValidator = (config: FileValidationConfig) => {
  return (file: File): { isValid: boolean; error?: string } => {
    if (file.size > config.maxSize) {
      return { isValid: false, error: config.errorMessages.size };
    }

    if (!config.allowedTypes.includes(file.type)) {
      return { isValid: false, error: config.errorMessages.type };
    }

    return { isValid: true };
  };
};

export const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2);
};

export const logFormDataContents = (formData: FormData): void => {
  console.log("FormData contents:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(
        key,
        `File: ${value.name} (${value.size} bytes, ${value.type})`
      );
    } else {
      console.log(key, value);
    }
  }
};
