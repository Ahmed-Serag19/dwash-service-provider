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

    // Decode the JWT token to get the payload
    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    // Check if the role is ADMIN
    if (decodedToken.role !== "FREELANCER") {
      sessionStorage.removeItem("accessToken");
      toast.error(t("loginErrorRole"));
      navigate("/login");
      return;
    }

    const logoutTimer = setTimeout(() => {
      sessionStorage.removeItem("accessToken");
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }, 90 * 60 * 1000);

    return () => clearTimeout(logoutTimer);
  }, [token]);

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
