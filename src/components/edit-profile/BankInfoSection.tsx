import type React from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import type { EditProfileFormData } from "@/interface/interfaces";

interface BankInfoSectionProps {
  control: any;
  errors: any;
}

export const BankInfoSection: React.FC<BankInfoSectionProps> = ({
  control,
  errors,
}) => {
  const { t } = useTranslation();

  const fields: Array<{
    name: keyof EditProfileFormData;
    label: string;
  }> = [
    { name: "iban", label: t("iban") },
    { name: "bankAccountNumber", label: t("bankAccountNumber") },
    { name: "bankName", label: t("bankName") },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {fields.map((field) => (
        <FormField
          key={field.name}
          name={field.name}
          label={field.label}
          control={control}
          errors={errors}
          rules={{ required: t("fieldRequired") }}
        />
      ))}
    </div>
  );
};
