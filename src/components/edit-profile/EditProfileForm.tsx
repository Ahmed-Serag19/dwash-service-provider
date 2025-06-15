import type React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { BankInfoSection } from "./BankInfoSection";
import { FileUploadSection } from "./FileUploadSection";
import { FormActions } from "./FormActions";
import { useEditProfile } from "@/hooks/useEditProfile";
import { useFormDefaults } from "@/hooks/useFormDefaults";
import type { EditProfileFormData, User } from "@/interface/interfaces";
import { OptimizedFileInput } from "./OptimizedFileInput";

interface EditProfileFormProps {
  user?: User;
  onCancel: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { submitProfile } = useEditProfile();
  const defaultValues = useFormDefaults(user);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    defaultValues,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("editProfile")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submitProfile)} className="space-y-6">
          <PersonalInfoSection control={control} errors={errors} />
          <BankInfoSection control={control} errors={errors} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OptimizedFileInput
              name="brandLogo"
              label={t("brandLogo")}
              control={control}
              accept="image/*"
            />
            <OptimizedFileInput
              name="brandBackgroundImage"
              label={t("brandBackgroundImage")}
              control={control}
              accept="image/*"
            />
            <OptimizedFileInput
              name="bankCertificate"
              label={t("bankCertificate")}
              control={control}
              accept="image/*,application/pdf"
            />
          </div>
          <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
        </form>
      </CardContent>
    </Card>
  );
};
