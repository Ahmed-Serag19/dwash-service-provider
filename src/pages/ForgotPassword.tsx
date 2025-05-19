import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { endpoints } from "../constants/endPoints";
import { InitiateFormData, FinalizeFormData } from "../interface/interfaces";

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<"initiate" | "finalize">("initiate");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InitiateFormData>();

  const { register: registerFinalize, handleSubmit: handleSubmitFinalize } =
    useForm<FinalizeFormData>();

  const onInitiate = async (data: InitiateFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.put(endpoints.initiateForgotPassword, null, {
        params: {
          email: data.email,
          language: i18n.language === "ar" ? "AR" : "EN",
        },
      });
      const result = response.data;
      if (result.success) {
        toast.success(t("initiateSuccess"));
        setEmail(data.email);
        setStep("finalize");
      } else {
        toast.error(t("initiateError"));
      }
    } catch (error) {
      toast.error(t("initiateError"));
    } finally {
      setIsLoading(false);
    }
  };

  const onFinalize = async (data: FinalizeFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.put(endpoints.finalizeForgotPassword, {
        email,
        confirmationCode: data.confirmationCode,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      const result = response.data;
      if (result.success) {
        toast.success(t("finalizeSuccess"));
        setStep("initiate");
      } else {
        toast.error(t("finalizeError"));
      }
    } catch (error) {
      toast.error(t("finalizeError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-stone-100"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          {step === "initiate" ? t("forgotPassword") : t("resetPassword")}
        </h2>

        {step === "initiate" ? (
          <form onSubmit={handleSubmit(onInitiate)} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("email")}
            </label>
            <input
              {...register("email", { required: t("emailRequired") as string })}
              type="email"
              className="w-full border p-2 rounded"
              placeholder={t("enterEmail")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800"
            >
              {isLoading ? t("loading") : t("sendCode")}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitFinalize(onFinalize)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border p-2 rounded bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("confirmationCode")}
              </label>
              <input
                {...registerFinalize("confirmationCode", {
                  required: t("codeRequired") as string,
                })}
                className="w-full border p-2 rounded"
                placeholder={t("enterCode")}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("newPassword")}
              </label>
              <input
                type="password"
                {...registerFinalize("newPassword", {
                  required: t("newPasswordRequired") as string,
                })}
                className="w-full border p-2 rounded"
                placeholder={t("enterNewPassword")}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("confirmNewPassword")}
              </label>
              <input
                type="password"
                {...registerFinalize("confirmNewPassword", {
                  required: t("confirmPasswordRequired") as string,
                })}
                className="w-full border p-2 rounded"
                placeholder={t("confirmPassword")}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800"
            >
              {isLoading ? t("loading") : t("resetPassword")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
