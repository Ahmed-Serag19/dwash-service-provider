import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
interface LogoutModalProps {
  handleCloseModal: () => void;
}

const LogoutModal = ({ handleCloseModal }: LogoutModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useUser();
  const handleLogout = () => {
    logout();
    toast.success(t("logoutSuccess"), {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
      className: "bg-blue-950",
    });
    navigate("/login");
  };

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 inset-0 z-50 bg-gray-500  bg-opacity-80 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg text-blue-950 font-semibold">
          {t("logoutConfirmation")}
        </h3>
        <div className="flex  gap-5 justify-center mt-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-blue-950 text-stone-50 rounded-md hover:bg-blue-800 transition-colors"
          >
            {t("confirm")}
          </button>
          <button
            onClick={handleCloseModal}
            className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors hover:text-white"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
