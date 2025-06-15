import type React from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import type { EditProfileFormData } from "@/interface/interfaces";

interface PersonalInfoSectionProps {
  control: any;
  errors: any;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  control,
  errors,
}) => {
  const { t } = useTranslation();

  const fields: Array<{
    name: keyof EditProfileFormData;
    label: string;
    textarea?: boolean;
  }> = [
    { name: "brandNameAr", label: t("brandNameAr") },
    { name: "brandNameEn", label: t("brandNameEn") },
    {
      name: "brandDescriptionsAr",
      label: t("brandDescriptionsAr"),
      textarea: true,
    },
    {
      name: "brandDescriptionsEn",
      label: t("brandDescriptionsEn"),
      textarea: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field) => (
        <FormField
          key={field.name}
          name={field.name}
          label={field.label}
          control={control}
          errors={errors}
          rules={{ required: t("fieldRequired") }}
          textarea={field.textarea}
        />
      ))}
    </div>
  );
};
