import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import { useTranslation } from "react-i18next";

interface FormData {
  brandNameAr: string;
  brandNameEn: string;
  email: string;
  brandDescriptionsAr: string;
  brandDescriptionsEn: string;
  iban: string;
  bankAccountNumber: string;
  bankName: string;
  brandLogo: FileList;
  brandBackgroundImage: FileList;
  bankCertificate: FileList;
}

const EditProfile: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormData>({
    defaultValues: {
      brandNameAr: user?.userDto?.nameAr || "",
      brandNameEn: user?.userDto?.nameEn || "",
      email: user?.userDto?.email || "",
      brandDescriptionsAr: user?.brandDescriptionsAr || "",
      brandDescriptionsEn: user?.brandDescriptionsEn || "",
      iban: user?.brandWalletDto?.iban || "",
      bankAccountNumber: user?.brandWalletDto?.bankAccountNumber || "",
      bankName: user?.brandWalletDto?.bankName || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      const brandReq = {
        brandNameAr: data.brandNameAr.trim(),
        brandNameEn: data.brandNameEn.trim(),
        brandDescriptionsAr: data.brandDescriptionsAr.trim(),
        brandDescriptionsEn: data.brandDescriptionsEn.trim(),
        iban: data.iban.trim(),
        bankAccountNumber: data.bankAccountNumber.trim(),
        bankName: data.bankName.trim(),
      };

      formData.append("brandReq", JSON.stringify(brandReq));

      if (data.brandLogo[0]) formData.append("brandLogo", data.brandLogo[0]);
      if (data.brandBackgroundImage[0])
        formData.append("brandBackgroundImage", data.brandBackgroundImage[0]);
      if (data.bankCertificate[0])
        formData.append("bankCertificate", data.bankCertificate[0]);

      await axios.put(endpoints.editUser, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      toast.success(t("profileUpdateSuccess"));
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(t("profileUpdateError"));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("editProfile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="brandNameAr"
                label={t("brandNameAr")}
                control={control}
                errors={errors}
                rules={{ required: t("fieldRequired") }}
              />
              <FormField
                name="brandNameEn"
                label={t("brandNameEn")}
                control={control}
                errors={errors}
                rules={{ required: t("fieldRequired") }}
              />
              <FormField
                name="email"
                label={t("email")}
                control={control}
                errors={errors}
                rules={{
                  required: t("fieldRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("invalidEmail"),
                  },
                }}
              />
              <FormField
                name="brandDescriptionsAr"
                label={t("brandDescriptionsAr")}
                control={control}
                errors={errors}
                rules={{ required: t("fieldRequired") }}
                textarea
              />
              <FormField
                name="brandDescriptionsEn"
                label={t("brandDescriptionsEn")}
                control={control}
                errors={errors}
                rules={{ required: t("fieldRequired") }}
                textarea
              />
              <FormField
                name="iban"
                label={t("iban")}
                control={control}
                errors={errors}
                rules={{ required: t("fieldRequired") }}
              />
              <FormField
                name="bankAccountNumber"
                label={t("bankAccountNumber")}
                control={control}
                errors={errors}
                rules={{ required: t("fieldRequired") }}
              />
              <FormField
                name="bankName"
                label={t("bankName")}
                control={control}
                errors={errors}
                rules={{ required: t("fieldRequired") }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FileInput
                name="brandLogo"
                label={t("brandLogo")}
                control={control}
                accept="image/*"
              />
              <FileInput
                name="brandBackgroundImage"
                label={t("brandBackgroundImage")}
                control={control}
                accept="image/*"
              />
              <FileInput
                name="bankCertificate"
                label={t("bankCertificate")}
                control={control}
                accept="image/*,application/pdf"
              />
            </div>

            <div className="flex justify-end space-x-4 gap-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile")}
              >
                {t("cancel")}
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className={isLoading ? "cursor-not-allowed bg-gray-500" : ""}
              >
                {t("save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

interface FormFieldProps {
  name: keyof FormData;
  label: string;
  control: any;
  errors: any;
  rules?: object;
  textarea?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  control,
  errors,
  rules,
  textarea = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) =>
        textarea ? (
          <Textarea
            {...field}
            id={name}
            className={error ? "border-red-500" : ""}
          />
        ) : (
          <Input
            {...field}
            id={name}
            className={error ? "border-red-500" : ""}
          />
        )
      }
    />
    {errors[name] && (
      <p className="text-red-500 text-sm">{errors[name].message}</p>
    )}
  </div>
);

interface FileInputProps {
  name: keyof FormData;
  label: string;
  control: any;
  accept: string;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  control,
  accept,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <Input
          {...field}
          id={name}
          type="file"
          onChange={(e) => onChange(e.target.files)}
          accept={accept}
        />
      )}
    />
  </div>
);

export default EditProfile;
