import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { GoBell, GoPersonFill } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";

interface HeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Navbar = ({ mobileOpen, setMobileOpen }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogout = () => {
    sessionStorage.removeItem("userInfo");
    toast.success(t("logoutSuccess"), {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
      className: "bg-blue-950",
    });
    navigate("/login");
  };
  const dropDownClassName =
    "outline-none cursor-pointer rounded-md transition font-semibold duration-300 hover:bg-slate-100 w-full px-3 my-3 py-2 hover:text-blue-800 ";
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <header className="sticky top-0 z-30 flex h-32 items-center min-h-16 justify-between border-b border-stone-200 bg-stone-50 px-4">
      <button
        className="md:hidden text-2xl"
        // size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <GiHamburgerMenu size={32} className="text-blue-950 h-7 w-7" />
      </button>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative hover:bg-stone-200 rounded-lg transition duration-300">
              <GoBell className="text-blue-950 w-7 h-7" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="md:w-52 border-blue-950 border-[1px] flex flex-col gap-2 p-2 rounded-md my-3 bg-slate-100"
          >
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-stone-400" />
            <DropdownMenuItem>New order received</DropdownMenuItem>
            <DropdownMenuItem>Payment confirmed</DropdownMenuItem>
            <DropdownMenuItem>Schedule updated</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="gap-2 text-md flex items-center font-semibold text-blue-950 px-2 py-2 rounded-md mx-3 hover:bg-stone-200 transition duration-300">
              <GoPersonFill className="" size={28} />
              John Doe
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="md:w-32 border-blue-950 border-[1px] flex flex-col gap-2 p-2 rounded-md my-2 bg-slate-100"
          >
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Modal for Logout Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-500  bg-opacity-80 flex justify-center items-center">
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
      )}
    </header>
  );
};

export default Navbar;
