import type React from "react";
import { useTranslation } from "react-i18next";
import { FileInput } from "./FileInput";

interface FileUploadSectionProps {
  control: any;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  control,
}) => {
  const { t } = useTranslation();

  const fileInputs = [
    { name: "brandLogo" as const, label: t("brandLogo"), accept: "image/*" },
    {
      name: "brandBackgroundImage" as const,
      label: t("brandBackgroundImage"),
      accept: "image/*",
    },
    {
      name: "bankCertificate" as const,
      label: t("bankCertificate"),
      accept: "image/*,application/pdf",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {fileInputs.map((input) => (
        <FileInput
          key={input.name}
          name={input.name}
          label={input.label}
          control={control}
          accept={input.accept}
        />
      ))}
    </div>
  );
};
