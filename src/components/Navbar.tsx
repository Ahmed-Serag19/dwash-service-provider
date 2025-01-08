import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import LogoutModal from "./LogoutModal";

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
    "outline-none cursor-pointer rounded-md transition font-semibold duration-300 hover:bg-slate-100 w-full px-3 my-1 py-2 hover:text-blue-800 hover:bg-stone-200";
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <header
      className="z-30 flex h-16 items-center min-h-16 justify-between border-b border-stone-200 bg-stone-50 px-4"
      dir="rtl"
    >
      <button
        className="md:hidden text-2xl"
        // size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <GiHamburgerMenu
          size={32}
          className="text-blue-950 h-7 w-7 hover:text-blue-800 transition duration-300"
        />
      </button>
      <div className="flex items-center gap-7">
        <LanguageSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="gap-2 text-md flex items-center font-semibold text-blue-950 hover:text-blue-700 px-2 py-2 rounded-md  hover:bg-stone-200 transition duration-300">
              <GoPersonFill size={28} />
              John Doe
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-42 border-blue-950 border-[1px] flex flex-col  rounded-md my-2 bg-slate-100"
          >
            <Link to="/profile">
              <DropdownMenuItem className={dropDownClassName}>
                Profile
              </DropdownMenuItem>
            </Link>
            <Link to="/change-password">
              <DropdownMenuItem className={dropDownClassName}>
                Change Password
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleOpenModal}
              className={dropDownClassName}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            className="md:w-52 mx-2 border-blue-950 border-[1px] flex flex-col   rounded-md my-3 bg-stone-100"
          >
            <DropdownMenuLabel className={dropDownClassName}>
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="" />
            <DropdownMenuItem className={dropDownClassName}>
              New order received
            </DropdownMenuItem>
            <DropdownMenuItem className={dropDownClassName}>
              Payment confirmed
            </DropdownMenuItem>
            <DropdownMenuItem className={dropDownClassName}>
              Schedule updated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Modal for Logout Confirmation */}
      {isModalOpen && <LogoutModal handleCloseModal={handleCloseModal} />}
    </header>
  );
};

export default Navbar;
