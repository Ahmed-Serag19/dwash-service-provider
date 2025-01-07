import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// Define form data type
interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.put(
        "/auth/changePassword",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(t("passwordChanged"));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(response.data.messageEn || t("unknownError"));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.messageEn || t("unknownError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 md:w-full border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        {t("changePassword")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            {t("currentPassword")}
          </label>
          <input
            type="password"
            {...register("currentPassword", { required: t("requiredField") })}
            className={`w-full p-2 border rounded ${
              errors.currentPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">{t("newPassword")}</label>
          <input
            type="password"
            {...register("newPassword", {
              required: t("requiredField"),
              minLength: { value: 8, message: t("passwordMinLength") },
            })}
            className={`w-full p-2 border rounded ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            {t("confirmNewPassword")}
          </label>
          <input
            type="password"
            {...register("confirmNewPassword", {
              required: t("requiredField"),
              validate: (value) =>
                value === watch("newPassword") || t("passwordMismatch"),
            })}
            className={`w-full p-2 border rounded ${
              errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmNewPassword.message?.toString()}
            </p>
          )}
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("changingPassword") : t("changePassword")}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
