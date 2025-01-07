import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { endpoints } from "../constants/endPoints";
import LoginPageImage from "@/assets/images/login-page-image.jpg";
import { normalizeErrorMessage } from "../utils/errorHandler";
import axios from "axios";

type LoginFormData = {
  username: string;
  password: string;
  local: string;
};

const Login = () => {
  const { t, i18n } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      data.local = i18n.language === "ar" ? "AR" : "EN";

      const response = await axios.post(endpoints.Login, {
        username: data.username,
        password: data.password,
        local: data.local,
      });

      const result = response.data;
      console.log(result);

      if (result.success) {
        const successMessage =
          i18n.language === "en" ? result.messageEn : result.messageAr;
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          className: "bg-blue-950",
        });

        sessionStorage.setItem("accessToken", result.content.token);
        navigate("/");
      } else {
        const errorMessage = normalizeErrorMessage(
          result.messageEn,
          result.messageAr
        );
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          className: "bg-red-500",
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle API error responses
        const { messageEn, messageAr } = error.response.data || {};
        const errorMessage = normalizeErrorMessage(messageEn, messageAr);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          className: "bg-red-500",
        });
      } else {
        // Handle network or unexpected errors
        console.error("Login error:", error);
        toast.error(t("networkError"), {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          className: "bg-red-500",
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex justify-around items-center min-h-screen w-full bg-stone-50 gap-5 py-4 relative sm:ps-2 sm:py-0">
      <div className="sm:max-w-xl sm:min-w-lg w-11/12 bg-white p-8 rounded-lg shadow-lg  space-y-14 sm:w-1/2">
        <h2 className="text-2xl font-semibold text-blue-950 mb-6">
          {t("login")}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-blue-950 font-semibold"
            >
              {t("username")}
            </label>
            <div className="flex items-center border-b border-blue-950">
              <FaUser className="text-gray-600  mr-2" />
              <input
                id="username"
                autoComplete="username"
                type="text"
                placeholder={t("usernamePlaceholder")}
                {...register("username", { required: "Username is required" })}
                className="w-full py-2 px-3 text-blue-950 focus:outline-none"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm">
                {errors.username.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-blue-950 font-semibold"
            >
              {t("password")}
            </label>
            <div className="flex items-center border-b border-blue-950">
              <FaLock className="text-gray-600  mr-2" />
              <input
                id="password"
                autoComplete="current-password"
                type={passwordVisible ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                {...register("password", { required: "Password is required" })}
                className="w-full py-2 px-3 text-blue-950 focus:outline-none"
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {passwordVisible ? (
                  <FaEyeSlash className="text-blue-950 hover:text-blue-700 text-lg transition duration-300" />
                ) : (
                  <FaEye className="text-blue-950 hover:text-blue-700 text-lg transition duration-300" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-950 text-white font-semibold rounded-md transition duration-300 hover:bg-blue-800"
            >
              {t("login")}
            </button>
          </div>
        </form>
      </div>
      <div className="h-screen w-6/12 hidden sm:block">
        <img
          src={LoginPageImage}
          alt="login page image"
          className="w-full h-full object-center object-cover "
        />
      </div>
      <div
        className={`absolute ${
          i18n.language === "ar" ? "bottom-10 right-10" : "left-10 bottom-10"
        }`}
      >
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Login;
