import { Navigate, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = sessionStorage.getItem("accessToken");
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    try {
      // Decode the JWT token
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Check role
      if (decodedToken.role !== "FREELANCER") {
        sessionStorage.removeItem("accessToken");
        toast.error(t("loginErrorRole"));
        navigate("/login");
        return;
      }

      // Check expiration
      const currentTime = Date.now() / 1000; // Convert to Unix timestamp
      if (decodedToken.exp < currentTime) {
        sessionStorage.removeItem("accessToken");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      // Calculate remaining time until expiration
      const remainingTime = (decodedToken.exp - currentTime) * 1000; // Convert to milliseconds

      // Set timeout for token expiration
      const logoutTimer = setTimeout(() => {
        sessionStorage.removeItem("accessToken");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }, remainingTime);

      return () => clearTimeout(logoutTimer);
    } catch (error) {
      console.error("Token validation error:", error);
      sessionStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, [token, navigate, t]);

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
